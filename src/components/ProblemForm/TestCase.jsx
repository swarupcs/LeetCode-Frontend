import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// interface TestCaseProps {
//   testCase: {
//     input: string
//     output: string
//     isPublic: boolean
//   }
//   index: number
//   onChange: (index: number, field: string, value: string | boolean) => void
//   onRemove: (index: number) => void
//   isAdmin?: boolean
// }

export default function TestCase({
  testCase,
  index,
  onChange,
  onRemove,
  isAdmin = true,
}) {
  return (
    <Card className='bg-premium-darker border border-premium-blue text-white shadow-lg premium-border-gradient'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='font-medium'>Test Case #{index + 1}</h3>
          <div className='flex items-center gap-4'>
            {isAdmin && (
              <div className='flex items-center gap-2'>
                <Switch
                  id={`test-case-visibility-${index}`}
                  checked={testCase.isPublic}
                  onCheckedChange={(checked) =>
                    onChange(index, 'isPublic', checked)
                  }
                  className='data-[state=checked]:bg-green-500'
                />
                <Label
                  htmlFor={`test-case-visibility-${index}`}
                  className='text-sm font-medium'
                >
                  {testCase.isPublic ? 'Public' : 'Private'}
                </Label>
              </div>
            )}

            {index > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onRemove(index)}
                className='h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10'
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium'>Input</label>
            <Input
              value={testCase.input}
              onChange={(e) => onChange(index, 'input', e.target.value)}
              placeholder='Enter test case input'
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium'>Expected Output</label>
            <Input
              value={testCase.expected}
              onChange={(e) => onChange(index, 'expected', e.target.value)}
              placeholder='Enter expected output'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
