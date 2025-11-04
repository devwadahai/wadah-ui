import { SearchBar } from '../SearchBar'
import { useState } from 'react'

export default function SearchBarExample() {
  const [value, setValue] = useState('')
  
  return (
    <div className="max-w-md">
      <SearchBar
        placeholder="Search agents..."
        value={value}
        onChange={setValue}
      />
      {value && <p className="mt-2 text-sm text-muted-foreground">Searching for: {value}</p>}
    </div>
  )
}
