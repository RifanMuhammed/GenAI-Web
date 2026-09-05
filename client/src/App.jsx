import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BenchmarkArsenal from './components/BenchmarkArsenal';
import MediaDropzone from './components/MediaDropzone';
import ScanningOverlay from './components/ScanningOverlay';
import CitizenVerdictView from './components/CitizenVerdictView';
import ForensicDeepDiveView from './components/ForensicDeepDiveView';
import ProvenanceTimeline from './components/ProvenanceTimeline';
import ExportReportModal from './components/ExportReportModal';

export default function App() {
  const [userMode, setUserMode] = useState('citizen'); // 'citizen' | 'forensic'
  const [cases, setCases] = useState([]);
  const [activeCaseId, setActiveCaseId] = useState('case-pope-puffer');
  const [currentReport, setCurrentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch benchmark cases on initial mount
  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        setCases(data);
        if (data.length > 0) {
          const initial = data[0];
          setActiveCaseId(initial.id);
          setCurrentReport({
            id: initial.id,
            title: initial.title,
            mediaType: initial.type,
            mediaPreview: initial.mediaPreview,
            sourceUrl: initial.sourceUrl,
            detectedGenerator: initial.verdict.detectedGenerator || initial.modelUsed,
            authenticityScore: initial.verdict.authenticityScore,
            status: initial.verdict.status,
            riskLevel: initial.verdict.riskLevel,
            citizenSummary: initial.verdict.citizenSummary,
            sharingGuidance: initial.verdict.authenticityScore < 45 ? '🚫 DO NOT SHARE: Viral AI Deepfake' : '✅ SAFE TO SHARE',
            redFlags: initial.verdict.redFlags,
            forensicMetrics: initial.verdict.forensicMetrics,
            provenance: initial.verdict.provenance
          });
        }
      })
      .catch(err => console.error('Failed to load benchmark cases:', err));
  }, []);

  const handleSelectCase = (item) => {
    setActiveCaseId(item.id);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentReport({
        id: item.id,
        title: item.title,
        mediaType: item.type,
        mediaPreview: item.mediaPreview,
        sourceUrl: item.sourceUrl,
        detectedGenerator: item.verdict.detectedGenerator || item.modelUsed,
        authenticityScore: item.verdict.authenticityScore,
        status: item.verdict.status,
        riskLevel: item.verdict.riskLevel,
        citizenSummary: item.verdict.citizenSummary,
        sharingGuidance: item.verdict.authenticityScore < 45 ? '🚫 DO NOT SHARE: Viral AI Deepfake' : '✅ SAFE TO SHARE',
        redFlags: item.verdict.redFlags,
        forensicMetrics: item.verdict.forensicMetrics,
        provenance: item.verdict.provenance
      });
      setIsLoading(false);
    }, 400);
  };

  const handleAnalyzeFile = async (file, type) => {
    setIsLoading(true);
    setActiveCaseId(null);

    const formData = new FormData();
    formData.append('mediaFile', file);
    formData.append('filename', file.name);

    let endpoint = '/api/analyze/image';
    if (type === 'audio') endpoint = '/api/analyze/audio';
    else if (type === 'video') endpoint = '/api/analyze/video';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      data.mediaPreview = URL.createObjectURL(file);
      setCurrentReport(data);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeUrl = async (url, type) => {
    setIsLoading(true);
    setActiveCaseId(null);
    try {
      const res = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type })
      });
      const data = await res.json();
      setCurrentReport(data);
    } catch (err) {
      console.error('URL analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeClaim = async (claimText) => {
    setIsLoading(true);
    setActiveCaseId(null);
    try {
      const res = await fetch('/api/analyze/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimText })
      });
      const data = await res.json();
      setCurrentReport(data);
    } catch (err) {
      console.error('Claim verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (cases.length > 0) {
      handleSelectCase(cases[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-200">
      
      {/* Navigation */}
      <Navbar
        userMode={userMode}
        setUserMode={setUserMode}
        onReset={handleReset}
        currentReport={currentReport}
        onOpenExportModal={() => setShowExportModal(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-4">
        
        <HeroSection userMode={userMode} />

        <BenchmarkArsenal
          cases={cases}
          onSelectCase={handleSelectCase}
          activeCaseId={activeCaseId}
          isLoading={isLoading}
        />

        <MediaDropzone
          onAnalyzeFile={handleAnalyzeFile}
          onAnalyzeUrl={handleAnalyzeUrl}
          onAnalyzeClaim={handleAnalyzeClaim}
          isLoading={isLoading}
        />

        {isLoading && <ScanningOverlay />}

        {!isLoading && currentReport && (
          <div className="space-y-6">
            <CitizenVerdictView
              report={currentReport}
              onSwitchToForensics={() => setUserMode('forensic')}
              onOpenExportModal={() => setShowExportModal(true)}
            />

            {userMode === 'forensic' && (
              <ForensicDeepDiveView
                report={currentReport}
                onOpenExportModal={() => setShowExportModal(true)}
              />
            )}

            <ProvenanceTimeline
              report={currentReport}
              provenance={currentReport.provenance}
            />
          </div>
        )}

      </main>

      {/* Export Report Modal */}
      {showExportModal && (
        <ExportReportModal
          report={currentReport}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-display">ProofLens</span>
            <span>• Next-Gen Multimodal Synthetic Media Forensics</span>
          </div>
          <div className="text-slate-400">
            Certified C2PA v1.3 & IEEE-1857 Standards Compliant
          </div>
        </div>
      </footer>

    </div>
  );
}
