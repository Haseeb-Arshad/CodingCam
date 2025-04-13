import React from 'react';

const LanguageDistribution = ({ languages }) => {
  const totalPercentage = languages.reduce((acc, lang) => acc + lang.percentage, 0);
  
  return (
    <div className="shadow-md p-4 bg-white rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Languages</h3>
      
      <div className="flex flex-col space-y-3 mb-4">
        {languages.map((lang) => (
          <div key={lang.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{lang.name}</span>
              <span className="text-sm text-gray-500">{lang.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${(lang.percentage / totalPercentage) * 100}%`,
                  backgroundColor: lang.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: lang.color }}
            ></div>
            <span className="text-xs text-gray-600">{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageDistribution;