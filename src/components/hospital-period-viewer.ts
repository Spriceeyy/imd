import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Select } from './ui/select';
import { Tabs } from './ui/tabs';
import HeatmapVisualizer from './HeatmapVisualizer';

interface HospitalPeriodViewerProps {
  defaultView?: 'deciles' | 'heatmap' | 'trends';
}

const HospitalPeriodViewer: React.FC<HospitalPeriodViewerProps> = ({ defaultView = 'deciles' }) => {
  const [selectedHospital, setSelectedHospital] = useState('');
  const [period, setPeriod] = useState({
    startMonth: new Date().getMonth(),
    endMonth: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [viewType, setViewType] = useState(defaultView);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const hospitals = [
    { id: 'blackpool', name: 'Blackpool' },
    { id: 'coventry', name: 'Coventry' },
    // ... add all hospitals
  ];

  const months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' }
  ];

  useEffect(() => {
    if (selectedHospital) {
      fetchData();
    }
  }, [selectedHospital, period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hospital-period-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospital: selectedHospital,
          ...period
        })
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Select
          value={selectedHospital}
          onValueChange={setSelectedHospital}
          placeholder="Select Hospital"
        >
          {hospitals.map(hospital => (
            <Select.Option key={hospital.id} value={hospital.id}>
              {hospital.name}
            </Select.Option>
          ))}
        </Select>

        <div className="flex gap-2">
          <Select
            value={period.startMonth.toString()}
            onValueChange={(value) => setPeriod(p => ({ ...p, startMonth: parseInt(value) }))}
            placeholder="Start Month"
          >
            {months.map(month => (
              <Select.Option key={month.value} value={month.value.toString()}>
                {month.label}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={period.endMonth.toString()}
            onValueChange={(value) => setPeriod(p => ({ ...p, endMonth: parseInt(value) }))}
            placeholder="End Month"
          >
            {months.map(month => (
              <Select.Option key={month.value} value={month.value.toString()}>
                {month.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading data...</p>
        </div>
      ) : data ? (
        <Tabs value={viewType} onValueChange={setViewType}>
          <Tabs.List>
            <Tabs.Trigger value="deciles">IMD Deciles</Tabs.Trigger>
            <Tabs.Trigger value="heatmap">Heatmap</Tabs.Trigger>
            <Tabs.Trigger value="trends">Trends</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="deciles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.deciles).map(([decile, count]) => (
                <div key={decile} className="flex items-center gap-2">
                  <span className="w-20">Decile {decile}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 rounded-full h-full"
                      style={{ width: `${(count as number / data.totalPostcodes * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right">
                    {((count as number / data.totalPostcodes * 100).toFixed(1))}%
                  </span>
                </div>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="heatmap">
            <HeatmapVisualizer data={data.heatmapData} />
          </Tabs.Content>

          <Tabs.Content value="trends">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.monthlyAverages.map((month: any) => (
                <Card key={`${month.year}-${month.month}`} className="p-4">
                  <h3 className="font-bold">
                    {months[month.month].label} {month.year}
                  </h3>
                  <p>Average IMD: {month.avgIMD.toFixed(2)}</p>
                  <p>Total Postcodes: {month.count}</p>
                </Card>
              ))}
            </div>
          </Tabs.Content>
        </Tabs>
      ) : null}
    </div>
  );
};

export default HospitalPeriodViewer;
