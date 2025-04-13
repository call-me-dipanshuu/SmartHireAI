import { useState } from 'react';
import { CardContent } from './CardContent';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';


export default function JobMatcher() {
  const [mode, setMode] = useState("recruiter");
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
  });
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    const endpoint = mode === 'recruiter' ? 'http://localhost:3001/api/find-candidates' : 'http://localhost:3001/api/find-jobs';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Job Matcher</h1>
      <div className="mb-4 flex gap-4">
        <Button onClick={() => setMode('recruiter')} variant={mode === 'recruiter' ? 'default' : 'outline'}>Recruiter</Button>
        <Button onClick={() => setMode('seeker')} variant={mode === 'seeker' ? 'default' : 'outline'}>Job Seeker</Button>
      </div>

      <Input className="mb-2" placeholder="Skills (comma separated)" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
      <Input className="mb-4" placeholder="Years of Experience" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
      <Button className="w-full mb-6" onClick={handleSubmit}>Find {mode === 'recruiter' ? 'Candidates' : 'Jobs'}</Button>

      {results.map((res, idx) => (
        <Card key={idx} className="mb-4">
          <CardContent className="p-4">
            <p><strong>{res.name || res.title}</strong></p>
            <p>{res.skills.join(', ')}</p>
            <p>{res.experience} years</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}