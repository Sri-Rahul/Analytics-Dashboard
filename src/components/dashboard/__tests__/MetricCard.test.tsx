import { render, screen } from '@testing-library/react';
import { DollarSign } from 'lucide-react';
import { MetricCard } from '../MetricCard';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Total Revenue',
    value: 45231,
    change: 20.1,
    changeType: 'positive' as const,
    icon: DollarSign,
  };

  it('renders the metric card with title and value', () => {
    render(<MetricCard {...defaultProps} />);
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('45,231')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(<MetricCard {...defaultProps} format="currency" />);
    
    expect(screen.getByText('$45,231')).toBeInTheDocument();
  });

  it('formats percentage values correctly', () => {
    render(<MetricCard {...defaultProps} value={85.5} format="percentage" />);
    
    expect(screen.getByText('85.5%')).toBeInTheDocument();
  });

  it('displays positive change correctly', () => {
    render(<MetricCard {...defaultProps} />);
    
    expect(screen.getByText('20.1% from last month')).toBeInTheDocument();
    expect(screen.getByText('↗')).toBeInTheDocument();
  });

  it('displays negative change correctly', () => {
    render(<MetricCard {...defaultProps} change={-15.2} changeType="negative" />);
    
    expect(screen.getByText('15.2% from last month')).toBeInTheDocument();
    expect(screen.getByText('↘')).toBeInTheDocument();
  });

  it('displays neutral change correctly', () => {
    render(<MetricCard {...defaultProps} change={0} changeType="neutral" />);
    
    expect(screen.getByText('0% from last month')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<MetricCard {...defaultProps} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});