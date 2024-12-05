import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import HospitalPeriodViewer from '@/components/HospitalPeriodViewer';

export default function DatabasePage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>IMD Database</CardTitle>
        </CardHeader>
        <CardContent>
          <HospitalPeriodViewer defaultView="deciles" />
        </CardContent>
      </Card>
    </div>
  );
}
