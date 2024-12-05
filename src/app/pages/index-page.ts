import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import HospitalPeriodViewer from '@/components/HospitalPeriodViewer';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>IMD Generator for Service Users</CardTitle>
        </CardHeader>
        <CardContent>
          <HospitalPeriodViewer />
        </CardContent>
      </Card>
    </div>
  );
}
