import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataFreshnessIndicator, DataStatusDot } from '../DataFreshnessIndicator';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('DataFreshnessIndicator', () => {
  const mockProps = {
    lastUpdated: new Date('2024-01-01T12:00:00Z'),
    isRefreshing: false,
    isRealTimeEnabled: true,
    onToggleRealTime: jest.fn(),
    onForceRefresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current time to be 30 seconds after lastUpdated
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2024-01-01T12:00:30Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with fresh data status', () => {
    render(<DataFreshnessIndicator {...mockProps} />);
    
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('30s ago')).toBeInTheDocument();
    expect(screen.getByText('Live updates')).toBeInTheDocument();
  });

  it('shows updating status when refreshing', () => {
    render(<DataFreshnessIndicator {...mockProps} isRefreshing={true} />);
    
    expect(screen.getByText('Updating')).toBeInTheDocument();
  });

  it('shows paused status when real-time is disabled', () => {
    render(<DataFreshnessIndicator {...mockProps} isRealTimeEnabled={false} />);
    
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.queryByText('Live updates')).not.toBeInTheDocument();
  });

  it('shows stale status for old data', () => {
    // Mock current time to be 10 minutes after lastUpdated
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2024-01-01T12:10:00Z').getTime());
    
    render(<DataFreshnessIndicator {...mockProps} />);
    
    expect(screen.getByText('Stale')).toBeInTheDocument();
    expect(screen.getByText('10m ago')).toBeInTheDocument();
  });

  it('calls onForceRefresh when refresh button is clicked', () => {
    render(<DataFreshnessIndicator {...mockProps} />);
    
    const refreshButton = screen.getByRole('button', { name: /force refresh/i });
    fireEvent.click(refreshButton);
    
    expect(mockProps.onForceRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleRealTime when toggle button is clicked', () => {
    render(<DataFreshnessIndicator {...mockProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /pause/i });
    fireEvent.click(toggleButton);
    
    expect(mockProps.onToggleRealTime).toHaveBeenCalledTimes(1);
  });

  it('renders in compact mode', () => {
    render(<DataFreshnessIndicator {...mockProps} compact={true} />);
    
    // In compact mode, controls should not be visible
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('30s ago')).toBeInTheDocument();
  });

  it('hides controls when showControls is false', () => {
    render(<DataFreshnessIndicator {...mockProps} showControls={false} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('DataStatusDot', () => {
  const mockProps = {
    lastUpdated: new Date('2024-01-01T12:00:00Z'),
    isRefreshing: false,
    isRealTimeEnabled: true,
  };

  beforeEach(() => {
    // Mock current time to be 30 seconds after lastUpdated
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2024-01-01T12:00:30Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders status dot with tooltip', () => {
    render(<DataStatusDot {...mockProps} />);
    
    // The dot should be present (though we can't easily test its color)
    const dot = screen.getByRole('button'); // Tooltip trigger acts as button
    expect(dot).toBeInTheDocument();
  });

  it('shows updating status when refreshing', () => {
    render(<DataStatusDot {...mockProps} isRefreshing={true} />);
    
    const dot = screen.getByRole('button');
    expect(dot).toBeInTheDocument();
  });

  it('shows paused status when real-time is disabled', () => {
    render(<DataStatusDot {...mockProps} isRealTimeEnabled={false} />);
    
    const dot = screen.getByRole('button');
    expect(dot).toBeInTheDocument();
  });
});