import { Button } from '../ui/button';
import { Input } from '../ui/input';
import InputField from './InputField';

// interface ExamplesProps {
//   example: {
//     input: string
//     output: string
//     explanation: string
//   }
//   onChange: (field: string, value: string) => void
// }

export default function Examples({ example, onChange, onRemove }) {
  return (
    <div className='space-y-4 border p-4 rounded-md'>
      <Input
        label='Input'
        value={example.input}
        onChange={(e) => onChange('input', e.target.value)}
        placeholder='Enter example input'
      />
      <Input
        label='Output'
        value={example.output}
        onChange={(e) => onChange('output', e.target.value)}
        placeholder='Enter example output'
      />
      <Input
        label='Explanation'
        value={example.explanation}
        onChange={(e) => onChange('explanation', e.target.value)}
        placeholder='Enter example explanation'
        multiline
      />
      <Button onClick={onRemove} size='sm' variant='destructive'>
        Remove Example
      </Button>
    </div>
  );
}