import React, { useState, useEffect } from 'react';
import { HeatmapVisualizer } from '../components/HeatmapVisualizer';

export default function IMDGenerator() {
 const [selectedHospital, setSelectedHospital] = useState('');
 const [period, setPeriod] = useState({
   startYear: new Date().getFullYear(),
   startMonth: 1,
   endYear: new Date().getFullYear(),
   endMonth: new Date().getMonth() + 1
 });
 const [postcodes, setPostcodes] = useState('');
 const [viewType, setViewType] = useState('input');
 const [data, setData] = useState(null);
 const [processing, setProcessing] = useState(false);
 const [hospitals, setHospitals] = useState([]);

 useEffect(() => {
   fetch('/api/hospitals')
     .then(res => res.json())
     .then(setHospitals)
     .catch(console.error);
 }, []);

 const handleSubmit = async () => {
   setProcessing(true);
   try {
     const postcodelist = postcodes.split(/[\n,]/).map(p => p.trim()).filter(p => p);
     const response = await fetch('/api/submit', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         hospital: selectedHospital,
         postcodes: postcodelist,
         year: period.startYear,
         month: period.startMonth
       })
     });
     const result = await response.json();
     await fetchPeriodData();
     setPostcodes('');
   } catch (error) {
     console.error('Error:', error);
   } finally {
     setProcessing(false);
   }
 };

 const fetchPeriodData = async () => {
   if (!selectedHospital) return;
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
     console.error('Error fetching period data:', error);
   }
 };

 useEffect(() => {
   if (selectedHospital) {
     fetchPeriodData();
   }
 }, [selectedHospital, period]);

 return (
   <div className="max-w-6xl mx-auto p-4">
     <div className="bg-white p-6 rounded-lg shadow">
       <div className="space-y-6">
         <select 
           value={selectedHospital}
           onChange={(e) => setSelectedHospital(e.target.value)}
           className="w-full p-2 border rounded"
         >
           <option value="">Select Hospital</option>
           {hospitals.map(hospital => (
             <option key={hospital.id} value={hospital.id}>
               {hospital.name}
             </option>
           ))}
         </select>

         <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium mb-2">Start Period</label>
             <div className="flex gap-2">
               <select
                 value={period.startYear}
                 onChange={(e) => setPeriod(p => ({ ...p, startYear: Number(e.target.value) }))}
                 className="p-2 border rounded"
               >
                 {[2023, 2024, 2025].map(year => (
                   <option key={year} value={year}>{year}</option>
                 ))}
               </select>
               <select
                 value={period.startMonth}
                 onChange={(e) => setPeriod(p => ({ ...p, startMonth: Number(e.target.value) }))}
                 className="p-2 border rounded"
               >
                 {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                   <option key={month} value={month}>
                     {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                   </option>
                 ))}
               </select>
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium mb-2">End Period</label>
             <div className="flex gap-2">
               <select
                 value={period.endYear}
                 onChange={(e) => setPeriod(p => ({ ...p, endYear: Number(e.target.value) }))}
                 className="p-2 border rounded"
               >
                 {[2023, 2024, 2025].map(year => (
                   <option key={year} value={year}>{year}</option>
                 ))}
               </select>
               <select
                 value={period.endMonth}
                 onChange={(e) => setPeriod(p => ({ ...p, endMonth: Number(e.target.value) }))}
                 className="p-2 border rounded"
               >
                 {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                   <option key={month} value={month}>
                     {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                   </option>
                 ))}
               </select>
             </div>
           </div>
         </div>

         <textarea
           value={postcodes}
           onChange={(e) => setPostcodes(e.target.value)}
           placeholder="Enter postcodes (one per line or comma-separated)"
           className="w-full min-h-[100px] p-2 border rounded"
         />

         <button 
           onClick={handleSubmit}
           disabled={processing}
           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
         >
           {processing ? 'Processing...' : 'Submit'}
         </button>

         {data && <HeatmapVisualizer data={data} />}
       </div>
     </div>
   </div>
 );
}