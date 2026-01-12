import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface AtsScoreChartProps {
  score: number;
}

export function AtsScoreChart({ score }: AtsScoreChartProps) {
  const data = [{
    name: 'Score',
    value: score,
    fill: 'hsl(var(--primary))'
  }];

  const getColor = (val: number) => {
    if (val >= 80) return 'hsl(142, 76%, 36%)'; // Green
    if (val >= 60) return 'hsl(45, 93%, 47%)';  // Yellow/Orange
    return 'hsl(0, 84%, 60%)';                  // Red
  };

  data[0].fill = getColor(score);

  return (
    <div className="relative w-full h-[250px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="90%" 
          barSize={20} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'hsl(var(--muted))' }}
            clockWise
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-5xl font-bold font-display text-foreground">{score}</span>
        <span className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mt-1">ATS Score</span>
      </div>
    </div>
  );
}
