import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import HospitalPeriodViewer from '@/components/HospitalPeriodViewer';

export default function HeatmapPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>IMD Heatmap Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <HospitalPeriodViewer defaultView="heatmap" />
        </CardContent>
      </Card>
    </div>
  );
}
