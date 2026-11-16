import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import '../styles/gestionCicloEscolar.css';
import '../styles/gestionGradosGrupos.css';
import { gradosGruposServicio } from '../services/gradosGruposServicio';
import type { CrearGrupoPayload, Grado, GrupoItem } from '../types/GradoGrupo';

import { PanelGrados } from '../components/PanelGrados';
import { TablaGrupos } from '../components/TablaGrupos';
import { ModalFormularioGrado } from '../components/ModalFormularioGrado';
import { ModalFormularioGrupo } from '../components/ModalNuevoGrupo';
import { ModalConfirmacionGrado } from '../components/ModalConfirmacionGrado';
import { ModalConfirmacionGrupo } from '../components/ModalConfirmacionGrupo';

export const GestionGradosGrupos: React.FC = () => {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState<Grado | null>(null);
  const [grupos, setGrupos] = useState<GrupoItem[]>([]);

  const [cargandoGrados, setCargandoGrados] = useState(true);
  const [cargandoGrupos, setCargandoGrupos] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modales de Formulario
  const [modalGradoAbierto, setModalGradoAbierto] = useState(false);
  const [gradoEnEdicion, setGradoEnEdicion] = useState<Grado | null>(null);

  const [modalGrupoAbierto, setModalGrupoAbierto] = useState(false);
  const [grupoEnEdicion, setGrupoEnEdicion] = useState<GrupoItem | null>(null);

  // 🔔 ESTADOS PARA MODALES DE CONFIRMACIÓN Y SUS DATOS TEMPORALES
  const [confirmarGradoAbierto, setConfirmarGradoAbierto] = useState(false);
  const [nombreGradoPendiente, setNombreGradoPendiente] = useState('');

  const [confirmarGrupoAbierto, setConfirmarGrupoAbierto] = useState(false);
  const [datosGrupoPendientes, setDatosGrupoPendientes] = useState<Partial<CrearGrupoPayload> | null>(null);

  const cargarGrados = async () => {
    try {
      setCargandoGrados(true);
      setError(null);
      const data = await gradosGruposServicio.listarGrados();
      setGrados(data);
      if (data.length > 0 && !gradoSeleccionado) {
        setGradoSeleccionado(data[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al consultar los grados.');
    } finally {
      setCargandoGrados(false);
    }
  };

  const cargarGrupos = async (gradoId: number) => {
    try {
      setCargandoGrupos(true);
      setError(null);
      const data = await gradosGruposServicio.listarGruposPorGrado(gradoId);
      setGrupos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al consultar los grupos.');
    } finally {
      setCargandoGrupos(false);
    }
  };

  useEffect(() => {
    cargarGrados();
  }, []);

  useEffect(() => {
    if (gradoSeleccionado) {
      cargarGrupos(gradoSeleccionado.id);
    }
  }, [gradoSeleccionado]);

  // -------------------------------------------------------------
  // PASO 1: Formulario solicita guardar -> Abre Modal de Confirmación
  // -------------------------------------------------------------
  const handleSolicitarGuardarGrado = async (nombre: string) => {
    setNombreGradoPendiente(nombre);
    setConfirmarGradoAbierto(true); // 👈 Activa el modal de confirmación
  };

  const handleSolicitarGuardarGrupo = async (payload: Partial<CrearGrupoPayload>) => {
    setDatosGrupoPendientes(payload);
    setConfirmarGrupoAbierto(true); // 👈 Activa el modal de confirmación
  };

  // -------------------------------------------------------------
  // PASO 2: Confirmación aceptada -> Ejecuta la llamada HTTP a la API
  // -------------------------------------------------------------
  const handleConfirmarGuardarGrado = async () => {
    try {
      setProcesando(true);
      setError(null);
      if (gradoEnEdicion) {
        await gradosGruposServicio.actualizarGrado(gradoEnEdicion.id, { nombre: nombreGradoPendiente });
      } else {
        await gradosGruposServicio.crearGrado({ nombre: nombreGradoPendiente });
      }
      setConfirmarGradoAbierto(false);
      setModalGradoAbierto(false);
      setGradoEnEdicion(null);
      await cargarGrados();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el grado.');
    } finally {
      setProcesando(false);
    }
  };

  const handleConfirmarGuardarGrupo = async () => {
    if (!datosGrupoPendientes || !gradoSeleccionado) return;
    try {
      setProcesando(true);
      setError(null);
      if (grupoEnEdicion) {
        await gradosGruposServicio.actualizarGrupo(grupoEnEdicion.id, datosGrupoPendientes);
      } else {
        await gradosGruposServicio.crearGrupo(datosGrupoPendientes as CrearGrupoPayload);
      }
      setConfirmarGrupoAbierto(false);
      setModalGrupoAbierto(false);
      setGrupoEnEdicion(null);
      await cargarGrupos(gradoSeleccionado.id);
      await cargarGrados();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el grupo.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="academico-container">
      {error && (
        <div className="materias-mensaje materias-mensaje--error margin-bottom-md" role="alert">
          <strong>Error en el servicio: </strong>
          <span>{error}</span>
        </div>
      )}

      <div className="academico-header">
        <div>
          <h1 className="academico-title">Grados y Grupos</h1>
          <p className="academico-subtitle">Administración de grupos por nivel escolar y cupos por aula</p>
        </div>
        {gradoSeleccionado && (
          <button
            className="btn-primary"
            onClick={() => {
              setGrupoEnEdicion(null);
              setModalGrupoAbierto(true);
            }}
            type="button"
          >
            <Plus size={16} />
            Nuevo grupo
          </button>
        )}
      </div>

      <div className="grados-grupos-grid">
        <PanelGrados
          cargando={cargandoGrados}
          gradoSeleccionado={gradoSeleccionado}
          grados={grados}
          onCrearGrado={() => {
            setGradoEnEdicion(null);
            setModalGradoAbierto(true);
          }}
          onEditarGrado={(grado) => {
            setGradoEnEdicion(grado);
            setModalGradoAbierto(true);
          }}
          onSeleccionarGrado={setGradoSeleccionado}
        />

        <TablaGrupos
          cargando={cargandoGrupos}
          gradoSeleccionado={gradoSeleccionado}
          grupos={grupos}
          onCrearGrupo={() => {
            setGrupoEnEdicion(null);
            setModalGrupoAbierto(true);
          }}
          onEditarGrupo={(grupo) => {
            setGrupoEnEdicion(grupo);
            setModalGrupoAbierto(true);
          }}
        />
      </div>

      {/* Modales de Formulario */}
      {modalGradoAbierto && (
        <ModalFormularioGrado
          key={gradoEnEdicion ? `modal-grado-edit-${gradoEnEdicion.id}` : 'modal-grado-nuevo'}
          abierto={modalGradoAbierto}
          cargando={procesando}
          gradoEnEdicion={gradoEnEdicion}
          onCerrar={() => setModalGradoAbierto(false)}
          onGuardar={handleSolicitarGuardarGrado}
        />
      )}

      {modalGrupoAbierto && gradoSeleccionado && (
        <ModalFormularioGrupo
          key={grupoEnEdicion ? `modal-grupo-edit-${grupoEnEdicion.id}` : 'modal-grupo-nuevo'}
          abierto={modalGrupoAbierto}
          cargando={procesando}
          gradoId={gradoSeleccionado.id}
          gradoNombre={gradoSeleccionado.nombre}
          grupoEnEdicion={grupoEnEdicion}
          onCerrar={() => setModalGrupoAbierto(false)}
          onGuardar={handleSolicitarGuardarGrupo}
        />
      )}

      {/* 🔔 MODALES DE CONFIRMACIÓN */}
      {confirmarGradoAbierto && (
        <ModalConfirmacionGrado
          abierto={confirmarGradoAbierto}
          cargando={procesando}
          esEdicion={Boolean(gradoEnEdicion)}
          nombre={nombreGradoPendiente}
          onCancelar={() => setConfirmarGradoAbierto(false)}
          onConfirmar={handleConfirmarGuardarGrado}
        />
      )}

      {confirmarGrupoAbierto && gradoSeleccionado && datosGrupoPendientes && (
        <ModalConfirmacionGrupo
          abierto={confirmarGrupoAbierto}
          capacidad={datosGrupoPendientes.capacidad || 30}
          cargando={procesando}
          esEdicion={Boolean(grupoEnEdicion)}
          gradoNombre={gradoSeleccionado.nombre}
          nombre={datosGrupoPendientes.nombre || ''}
          onCancelar={() => setConfirmarGrupoAbierto(false)}
          onConfirmar={handleConfirmarGuardarGrupo}
          turno={datosGrupoPendientes.turno || 'Matutino'}
        />
      )}
    </div>
  );
};