import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputScreen from './InputScreen';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  UploadCloud: () => <div data-testid="upload-icon" />,
  Mic: () => <div data-testid="mic-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Cloud: () => <div data-testid="cloud-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  RefreshCcw: () => <div data-testid="refresh-icon" />,
  FileText: () => <div data-testid="file-icon" />
}));

describe('InputScreen Portfolio Verification', () => {
    it('renders the initial layout with core inputs', () => {
        render(<InputScreen onAnalyze={vi.fn()} />);
        
        expect(screen.getByText('Immediate Triage & Logistics Engine')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Describe the medical emergency/i)).toBeInTheDocument();
        expect(screen.getByText('Start Analysis')).toBeInTheDocument();
    });

    it('forces validation when submitting empty fields', () => {
        const analyzeMock = vi.fn();
        render(<InputScreen onAnalyze={analyzeMock} />);
        
        const submitBtn = screen.getByText('Start Analysis');
        fireEvent.click(submitBtn);

        // Analyze shouldn't be called without input
        expect(analyzeMock).not.toHaveBeenCalled();
    });
});
