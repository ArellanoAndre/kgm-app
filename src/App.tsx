import { useState } from 'react'
import BarraLateral from './components/layout/BarraLateral'
import type { ModuloId } from './components/layout/modulosBarraLateral'
import './App.css'

function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('docentes')

  return (
    <div className="aplicacion">
      <BarraLateral moduloActivo={moduloActivo} alCambiarModulo={setModuloActivo} />
      <main className="area-prueba">
        <section className="area-prueba__tarjeta">
          <p className="area-prueba__etiqueta">Texto de ejemplo aca bien machin</p>
          <h1>BBC</h1>
          <p>
            No pos aca nomas vamos poniendo todo lo demas en cada pantalla de cada uno xd lol 76532097 :v
          </p>
        </section>
      </main>
    </div>
  )
}
export default App
