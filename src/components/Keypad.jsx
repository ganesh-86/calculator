import Button from './Button'

export default function Keypad({ onAction }) {
  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 h-[380px]">
      {/* Row 1 */}
      <Button variant="danger" className="col-span-2" onClick={() => onAction('clear')}>AC</Button>
      <Button variant="secondary" onClick={() => onAction('delete')}>DEL</Button>
      <Button variant="secondary" onClick={() => onAction('operator', '÷')}>÷</Button>

      {/* Row 2 */}
      <Button variant="default" onClick={() => onAction('number', '7')}>7</Button>
      <Button variant="default" onClick={() => onAction('number', '8')}>8</Button>
      <Button variant="default" onClick={() => onAction('number', '9')}>9</Button>
      <Button variant="secondary" onClick={() => onAction('operator', '×')}>×</Button>

      {/* Row 3 */}
      <Button variant="default" onClick={() => onAction('number', '4')}>4</Button>
      <Button variant="default" onClick={() => onAction('number', '5')}>5</Button>
      <Button variant="default" onClick={() => onAction('number', '6')}>6</Button>
      <Button variant="secondary" onClick={() => onAction('operator', '-')}>-</Button>

      {/* Row 4 */}
      <Button variant="default" onClick={() => onAction('number', '1')}>1</Button>
      <Button variant="default" onClick={() => onAction('number', '2')}>2</Button>
      <Button variant="default" onClick={() => onAction('number', '3')}>3</Button>
      <Button variant="secondary" onClick={() => onAction('operator', '+')}>+</Button>

      {/* Row 5 */}
      <Button variant="default" className="col-span-2" onClick={() => onAction('number', '0')}>0</Button>
      <Button variant="default" onClick={() => onAction('number', '.')}>.</Button>
      <Button variant="primary" onClick={() => onAction('calculate')}>=</Button>
    </div>
  )
}
