import { useState, useEffect } from 'react';
import "./mod-delete.css";

interface ModExcluirProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function ModExcluir({ isOpen, onClose, onConfirm }: ModExcluirProps) {
  if (!isOpen) return null;

  return (
    <div className='delete-overlay' onClick={onClose}>
      <div className='delete-container' onClick={(e) => e.stopPropagation()}>
        <div className='delete-content'>
          <button className='close-modal-btn' onClick={onClose}>
            X
          </button>

          <h2>Excluir</h2>
          <p>Essa ação não poderá ser desfeita.</p>

          <div className='delete-actions-wrapper'>
            <div className='modal-buttons'>
              <button type='button' onClick={onClose}>Cancelar</button>
              <button type='button' onClick={onConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModExcluir;