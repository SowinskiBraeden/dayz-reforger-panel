import "../styles/Modal.css";

interface ServicePickerModalProps {
  services: any[];
  onClose: () => void;
  onSelect: (serviceId: string) => void;
}

export default function ServiceSelectModal({
  services,
  onClose,
  onSelect,
}: ServicePickerModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Select a Nitrado Server</h2>

        <div className="modal-service-list">
          {services.map((s) => (
            <div
              key={s.id}
              className="modal-service-item"
              onClick={() => onSelect(s.id)}
            >
              <strong>{s.details?.name || s.id}</strong>
              <p>{s.details?.address || "No IP available"}</p>
            </div>
          ))}
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
