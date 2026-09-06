import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BenchmarkArsenal from './components/BenchmarkArsenal';
import MediaDropzone from './components/MediaDropzone';
import ScanningOverlay from './components/ScanningOverlay';
import CitizenVerdictView from './components/CitizenVerdictView';
import ForensicDeepDiveView from './components/ForensicDeepDiveView';
import ProvenanceTimeline from './components/ProvenanceTimeline';
import ExportReportModal from './components/ExportReportModal';
import { sampleCases, formatReportFromCase } from './data/sampleCases';

export default function App() {
  const [userMode, setUserMode] = useState('citizen'); // 'citizen' | 'forensic'
  const [cases, setCases] = useState(sampleCases);
  const [activeCaseId, setActiveCaseId] = useState(sampleCases[0]?.id || 'case-pope-puffer');
  const [currentReport, setCurrentReport] = useState(formatReportFromCase(sampleCases[0]));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch benchmark cases on initial mount (with safe fallback)
  useEffect(() => {
    fetch('/api/cases')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCases(data);
        }
      })
      .catch(err => {
        // Fallback already preloaded from bundled sampleCases
        console.warn('API cases fetch notice (using bundled fallback):', err.message);
      });
  }, []);

  const handleSelectCase = (item) => {
    setErrorMessage(null);
    setActiveCaseId(item.id);
    setIsLoading(true);
    setTimeout(() => {
      const formatted = formatReportFromCase(item);
      if (formatted) {
        setCurrentReport(formatted);
      }
      setIsLoading(false);
    }, 250);
  };

  const handleAnalyzeFile = async (file, type) => {
    setIsLoading(true);
    setErrorMessage(null);
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
      if (!res.ok) {
        setErrorMessage(data.error || 'Media signature validation failed. Please check file format.');
        return;
      }
      data.mediaPreview = URL.createObjectURL(file);
      setCurrentReport(data);
    } catch (err) {
      setErrorMessage('Network error occurred while submitting media for analysis.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeUrl = async (url, type) => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveCaseId(null);
    try {
      const res = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Unable to safely verify remote media URL.');
        return;
      }
      setCurrentReport(data);
    } catch (err) {
      setErrorMessage('Network error occurred while analyzing URL.');
      console.error('URL analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeClaim = async (claimText) => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveCaseId(null);
    try {
      const res = await fetch('/api/analyze/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimText })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Claim verification failed.');
        return;
      }
      setCurrentReport(data);
    } catch (err) {
      setErrorMessage('Network error occurred during fact-check analysis.');
      console.error('Claim verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setErrorMessage(null);
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

        {/* User Alert / Error Notification Banner */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto my-4 p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 flex items-start justify-between gap-3 shadow-xl animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold block text-white mb-0.5">Verification Notice:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 text-red-400 hover:text-white rounded-lg hover:bg-red-900/50 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
