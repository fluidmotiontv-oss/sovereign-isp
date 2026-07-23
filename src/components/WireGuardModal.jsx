import React, { useState } from 'react';
import { Download, Copy, Check, X, ShieldCheck, Terminal } from 'lucide-react';

export default function WireGuardModal({ subscriber, onClose }) {
  const [copied, setCopied] = useState(false);

  const confContent = `[Interface]
# Sovereign ISP Tunnel for ${subscriber.handle}
PrivateKey = [YOUR_CLIENT_PRIVATE_KEY]
Address = ${subscriber.ip}/32, 2a0f:9400::10/128
DNS = 10.64.0.1, 10.64.0.2

[Peer]
# Sovereign AS65001 Gateway Alpha
PublicKey = 9xK2...mL8P=
Endpoint = 185.220.101.1:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`;

  const copyConfig = () => {
    navigator.clipboard.writeText(confContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([confContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${subscriber.handle}_sovereign_mesh.conf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel" style={{ width: '520px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>WIREGUARD NOISE IK</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>WireGuard Config: {subscriber.handle}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Import this <span className="font-mono" style={{ color: '#34d399' }}>.conf</span> file into WireGuard or OpenWrt on your home router to connect to the Sovereign Mesh network.
        </p>

        <pre className="font-mono" style={{ padding: '16px', background: '#090d16', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.6)', color: '#34d399', fontSize: '0.8rem', overflowX: 'auto', lineHeight: 1.5 }}>
          {confContent}
        </pre>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={copyConfig} style={{ flex: 1, justifyContent: 'center' }}>
            {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Raw Config"}
          </button>
          <button className="btn-primary" onClick={downloadFile} style={{ flex: 1, justifyContent: 'center' }}>
            <Download size={16} /> Download .conf File
          </button>
        </div>

      </div>
    </div>
  );
}
