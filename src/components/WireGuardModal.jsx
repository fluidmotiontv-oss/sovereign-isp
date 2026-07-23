import React, { useState } from 'react';
import { Download, Copy, Check, X, ShieldCheck, QrCode, Smartphone } from 'lucide-react';

export default function WireGuardModal({ subscriber, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'raw'

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

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(confContent)}`;

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
      <div className="glass-panel" style={{ width: '480px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>WIREGUARD MESH TUNNEL</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Connect Peer: {subscriber.handle}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* View Toggle Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveTab('qr')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              background: activeTab === 'qr' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'qr' ? '#34d399' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <QrCode size={16} /> Scan QR with Phone
          </button>
          <button 
            onClick={() => setActiveTab('raw')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              background: activeTab === 'raw' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'raw' ? '#34d399' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={16} /> Raw Config (.conf)
          </button>
        </div>

        {activeTab === 'qr' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '12px 0' }}>
            <div style={{ padding: '12px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              <img src={qrImageUrl} alt="WireGuard QR Code" style={{ width: '220px', height: '220px', display: 'block' }} />
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>📱 How to Scan from your Phone:</div>
              1. Open the <b>WireGuard</b> app on your iPhone or Android.<br />
              2. Tap <b>+</b> ➔ <b>Create from QR code</b>.<br />
              3. Point your camera at this QR code and tap <b>Save</b>!
            </div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Import this <span className="font-mono" style={{ color: '#34d399' }}>.conf</span> file directly into your WireGuard client.
            </p>

            <pre className="font-mono" style={{ padding: '14px', background: '#090d16', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.6)', color: '#34d399', fontSize: '0.75rem', overflowX: 'auto', lineHeight: 1.4 }}>
              {confContent}
            </pre>
          </>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <button className="btn-secondary" onClick={copyConfig} style={{ flex: 1, justifyContent: 'center' }}>
            {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Text"}
          </button>
          <button className="btn-primary" onClick={downloadFile} style={{ flex: 1, justifyContent: 'center' }}>
            <Download size={16} /> Download .conf
          </button>
        </div>

      </div>
    </div>
  );
}
