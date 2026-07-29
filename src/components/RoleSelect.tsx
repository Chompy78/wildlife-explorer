import { roles } from '../data/roles';

type RoleSelectProps = {
  onSelectRole: (roleId: string) => void;
};

export function RoleSelect({ onSelectRole }: RoleSelectProps) {
  return (
    <main className="screen">
      <section className="panel wide-panel">
        <p className="eyebrow">Choose Your Explorer</p>
        <h1>Pick a role</h1>
        <p className="muted">Each role gives a small bonus (Custom Character is saved for later). No role is the best choice - pick whichever explorer sounds most fun.</p>
        <div className="role-grid">
          {roles.map((role) => (
            <button key={role.id} className="role-card" onClick={() => onSelectRole(role.id)}>
              <strong>{role.name}</strong>
              <span>{role.description}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
