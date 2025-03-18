import React from 'react';
import { formatTime } from '@/lib/mockData';

const ActivityTimeline = ({ activity }) => {
  return (
    <div className="k-card h-full shadow-md">
      <div className="k-card-header p-4 border-b bg-blue-50">
        <h5 className="k-card-title text-lg font-semibold text-gray-800">Recent Activity</h5>
      </div>
      <div className="k-card-body p-4" style={{ height: '280px', overflowY: 'auto' }}>
        <div className="space-y-4">
          {activity.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border p-3 bg-white hover:bg-blue-50 transition-all"
            >
              <div
                className="mt-1 h-3 w-3 rounded-full"
                style={{
                  backgroundColor:
                    item.language === 'TypeScript'
                      ? '#007ACC'
                      : item.language === 'JavaScript'
                      ? '#F7DF1E'
                      : '#E34F26',
                }}
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{item.project}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {item.language} • {formatTime(item.duration)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;