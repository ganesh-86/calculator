import Button from './Button'

export default function ScientificKeypad({ onAction }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 h-[380px] w-full min-w-[160px]">
      <Button variant="default" className="text-[1.1rem]" onClick={() => onAction('unary', 'sin')}>sin</Button>
      <Button variant="default" className="text-[1.1rem]" onClick={() => onAction('unary', 'cos')}>cos</Button>
      
      <Button variant="default" className="text-[1.1rem]" onClick={() => onAction('unary', 'tan')}>tan</Button>
      <Button variant="default" className="text-[1.1rem]" onClick={() => onAction('unary', 'log')}>log</Button>
      
      <Button variant="default" className="text-[1.1rem]" onClick={() => onAction('unary', 'ln')}>ln</Button>
      <Button variant="default" className="text-[1.1rem]" onClick={() => onAction('unary', '√')}>√</Button>
      
      <Button variant="default" className="text-[1.1rem]" onClick={() => onAction('unary', '²')}>x²</Button>
      <Button variant="default" className="text-[1.1rem]" onClick={() => onAction('operator', '^')}>x^y</Button>
      
      <Button variant="secondary" className="text-xl font-serif italic" onClick={() => onAction('constant', 'π')}>π</Button>
      <Button variant="secondary" className="text-xl font-serif italic" onClick={() => onAction('constant', 'e')}>e</Button>
    </div>
  )
}
