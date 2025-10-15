import React, { useState } from 'react';

const TestConnection = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addTestResult = (testName: string, result: any) => {
    setTestResults(prev => [...prev, { testName, result, timestamp: new Date().toISOString() }]);
  };

  const testBackendConnection = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    try {
      // Test 1: Direct fetch to backend
      try {
        const response = await fetch('http://localhost:5000/api/v1/auth/login', {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        addTestResult('Direct OPTIONS request', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (error: any) {
        addTestResult('Direct OPTIONS request failed', { 
          error: error instanceof Error ? error.message : 'Unknown error occurred' 
        });
      }

      // Test 2: Test with proxy
      try {
        const response = await fetch('/api/v1/auth/login', {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        addTestResult('Proxy OPTIONS request', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (error: any) {
        addTestResult('Proxy OPTIONS request failed', { 
          error: error instanceof Error ? error.message : 'Unknown error occurred' 
        });
      }

      // Test 3: Test actual login endpoint
      try {
        const response = await fetch('http://localhost:5000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com', password: 'test' }),
        });
        
        let responseData;
        try {
          responseData = await response.json();
        } catch (e) {
          responseData = { error: 'Failed to parse JSON response' };
        }
        
        addTestResult('Direct POST request', {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (error: any) {
        addTestResult('Direct POST request failed', { 
          error: error instanceof Error ? error.message : 'Unknown error occurred' 
        });
      }
      
    } catch (error: any) {
      addTestResult('Test execution error', { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Connection Tester</h2>
      <button 
        onClick={testBackendConnection}
        disabled={isTesting}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isTesting ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isTesting ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {isTesting ? 'Testing...' : 'Run Connection Tests'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '15px',
          backgroundColor: '#f9f9f9',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          {testResults.length === 0 ? (
            <p>No test results yet. Click the button above to run tests.</p>
          ) : (
            <pre style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: '0',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              {testResults.map((test, index) => (
                <div key={index} style={{
                  marginBottom: '15px',
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: test.result?.status >= 400 ? '#ffebee' : '#e8f5e9'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {test.testName}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '5px' }}>
                    {test.timestamp}
                  </div>
                  <div>
                    {JSON.stringify(test.result, null, 2)}
                  </div>
                </div>
              ))}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
