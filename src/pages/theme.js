// THIS IS THE MASTER CONTROL FOR THE ENTIRE APP'S COLORS AND STYLES
// If you change a color here, it updates across the whole hospital system!

export const colors = {
  // Backgrounds
  bgDeep: '#020c1b',           // The deepest navy blue (main background)
  bgCard: 'rgba(17, 34, 64, 0.6)', // The glassmorphism card background
  bgInput: 'rgba(2, 12, 27, 0.8)', // The input field background
  
  // Text
  textWhite: '#e6f1ff',        // Main text color
  textMuted: '#8892b0',        // Subtext / labels
  
  // Accents
  cyan: '#00FFFF',             // Primary glowing accent
  gold: '#D4AF37',             // Secondary premium accent
  green: '#2ecc71',            // Success / Paid / Available
  red: '#e74c3c',              // Danger / Delete / Unpaid
  orange: '#f39c12',           // Warning / Pending
  purple: '#9b59b6',           // Special (e.g., Night shift)
};

export const styles = {
  // Reusable Glowing Separator Line
  separator: {
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${colors.cyan}80, transparent)`,
    margin: '20px 0',
    boxShadow: `0 0 10px ${colors.cyan}4D`,
  },
  // Reusable Premium Card
  card: {
    backgroundColor: colors.bgCard,
    backdropFilter: 'blur(12px)',
    padding: '30px',
    borderRadius: '16px',
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    border: `1px solid ${colors.cyan}1A`,
  },
  // Reusable Input Field
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1px solid ${colors.cyan}33`,
    backgroundColor: colors.bgInput,
    color: colors.textWhite,
    outline: 'none',
    boxSizing: 'border-box',
  },
  // Reusable Primary Button
  buttonPrimary: {
    padding: '15px',
    background: `linear-gradient(90deg, ${colors.cyan}, #00C6C6)`,
    color: colors.bgDeep,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  }
};