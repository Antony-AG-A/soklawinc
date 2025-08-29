import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { mondayHealthCheck } from '../Mondayapi';

interface ApiStatusProps {
  className?: string;
  showDetails?: boolean;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  details: {
    apiConnection: boolean;
    boardAccess: boolean;
    columnsLoaded: boolean;
    responseTime: number;
  };
  error?: string;
  lastChecked: Date;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ className = '', showDetails = false }) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'healthy',
    details: {
      apiConnection: false,
      boardAccess: false,
      columnsLoaded: false,
      responseTime: 0
    },
    lastChecked: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const result = await mondayHealthCheck();
      setHealthStatus({
        ...result,
        lastChecked: new Date()
      });
    } catch (error) {
      setHealthStatus({
        status: 'unhealthy',
        details: {
          apiConnection: false,
          boardAccess: false,
          columnsLoaded: false,
          responseTime: 0
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Check health on mount and every 5 minutes
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isChecking) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    
    switch (healthStatus.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unhealthy':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (!showDetails) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor()} ${className}`}>
        {getStatusIcon()}
        <span className="text-xs font-medium capitalize">
          {isChecking ? 'Checking...' : healthStatus.status}
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-semibold capitalize">
            Monday CRM {isChecking ? 'Checking...' : healthStatus.status}
          </span>
        </div>
        <button
          onClick={checkHealth}
          disabled={isChecking}
          className="p-1 hover:bg-white/50 rounded transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Detailed Status */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>API Connection:</span>
          <span className={healthStatus.details.apiConnection ? 'text-green-600' : 'text-red-600'}>
            {healthStatus.details.apiConnection ? '✓ Connected' : '✗ Failed'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Board Access:</span>
          <span className={healthStatus.details.boardAccess ? 'text-green-600' : 'text-red-600'}>
            {healthStatus.details.boardAccess ? '✓ Accessible' : '✗ Denied'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Columns Loaded:</span>
          <span className={healthStatus.details.columnsLoaded ? 'text-green-600' : 'text-red-600'}>
            {healthStatus.details.columnsLoaded ? '✓ Loaded' : '✗ Failed'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Response Time:</span>
          <span className={healthStatus.details.responseTime < 2000 ? 'text-green-600' : 'text-yellow-600'}>
            {formatResponseTime(healthStatus.details.responseTime)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Last Checked:</span>
          <span>{healthStatus.lastChecked.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Error Details */}
      {healthStatus.error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
          <strong>Error:</strong> {healthStatus.error}
        </div>
      )}
    </div>
  );
};

export default ApiStatus;</parameter>