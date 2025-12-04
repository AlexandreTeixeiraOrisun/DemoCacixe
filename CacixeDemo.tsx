import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Users, Truck, Plus, Edit2, Trash2, RefreshCw, Wifi, WifiOff, Key } from 'lucide-react';

// Types de véhicules avec CACES requis
const VEHICLE_TYPES = {
  'R489-1A': { name: 'Chariot élévateur < 6T', caces: 'R489-1A', icon: '🏗️' },
  'R489-3': { name: 'Chariot élévateur tout-terrain', caces: 'R489-3', icon: '🚜' },
  'R482-A': { name: 'Engin compact', caces: 'R482-A', icon: '🚧' },
  'R482-C1': { name: 'Pelle hydraulique < 6T', caces: 'R482-C1', icon: '⚒️' },
  'R482-F': { name: 'Chargeuse', caces: 'R482-F', icon: '🏗️' }
};

// Données exemple
const initialVehicles = [
  { id: 1, name: 'Pelle CAT 320', numero: 'ENG-001', type: 'R482-C1', lastUpdate: new Date(), espStatus: 'online', currentUser: 'Jean Dupont' },
  { id: 2, name: 'Chariot Fenwick', numero: 'ENG-002', type: 'R489-1A', lastUpdate: new Date(Date.now() - 48*3600000), espStatus: 'offline', currentUser: null },
  { id: 3, name: 'Chargeuse JCB', numero: 'ENG-003', type: 'R482-F', lastUpdate: new Date(), espStatus: 'online', currentUser: 'Marie Martin' }
];

const initialOperators = [
  { id: 1, name: 'Jean Dupont', badge: 'B001', caces: ['R482-C1', 'R482-F'], expirations: { 'R482-C1': '2025-06-15', 'R482-F': '2025-08-20' } },
  { id: 2, name: 'Marie Martin', badge: 'B002', caces: ['R482-F', 'R489-1A'], expirations: { 'R482-F': '2025-12-10', 'R489-1A': '2024-11-30' } },
  { id: 3, name: 'Pierre Durand', badge: 'B003', caces: ['R489-3'], expirations: { 'R489-3': '2025-03-22' } }
];

const initialLogs = [
  { id: 1, vehicleId: 1, operatorId: 1, timestamp: new Date(Date.now() - 2*3600000), action: 'Démarrage' },
  { id: 2, vehicleId: 3, operatorId: 2, timestamp: new Date(Date.now() - 1*3600000), action: 'Démarrage' },
  { id: 3, vehicleId: 1, operatorId: 1, timestamp: new Date(Date.now() - 25*3600000), action: 'Arrêt' }
];

function App() {
  const [view, setView] = useState('dashboard');
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [operators, setOperators] = useState(initialOperators);
  const [logs, setLogs] = useState(initialLogs);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // Dashboard - Vue d'ensemble
  const DashboardView = () => {
    const activeVehicles = vehicles.filter(v => v.currentUser);
    const alerts = vehicles.filter(v => {
      const hoursSinceUpdate = (Date.now() - v.lastUpdate) / (1000 * 3600);
      return hoursSinceUpdate > 24;
    });

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord</h2>
        
        {/* Alertes */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
              <AlertCircle size={20} />
              <span>Alertes ({alerts.length})</span>
            </div>
            {alerts.map(v => (
              <div key={v.id} className="text-sm text-red-700">
                • {v.name} ({v.numero}) - Pas de mise à jour depuis plus de 24h
              </div>
            ))}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Truck className="text-blue-600" size={32} />
              <div>
                <div className="text-2xl font-bold text-blue-900">{vehicles.length}</div>
                <div className="text-sm text-blue-700">Engins total</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="text-green-600" size={32} />
              <div>
                <div className="text-2xl font-bold text-green-900">{activeVehicles.length}</div>
                <div className="text-sm text-green-700">En utilisation</div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Key className="text-purple-600" size={32} />
              <div>
                <div className="text-2xl font-bold text-purple-900">{operators.length}</div>
                <div className="text-sm text-purple-700">Intervenants</div>
              </div>
            </div>
          </div>
        </div>

        {/* Engins en cours d'utilisation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Engins en cours d'utilisation</h3>
          {activeVehicles.length === 0 ? (
            <p className="text-gray-500">Aucun engin en utilisation</p>
          ) : (
            <div className="space-y-3">
              {activeVehicles.map(v => {
                const operator = operators.find(o => o.name === v.currentUser);
                return (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{VEHICLE_TYPES[v.type]?.icon}</span>
                      <div>
                        <div className="font-semibold">{v.name}</div>
                        <div className="text-sm text-gray-600">{v.numero}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{v.currentUser}</div>
                        <div className="text-xs text-gray-500">{operator?.badge}</div>
                      </div>
                      <Clock className="text-blue-600" size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Types de véhicules */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Engins par catégorie</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(VEHICLE_TYPES).map(([key, type]) => {
              const count = vehicles.filter(v => v.type === key).length;
              return (
                <button
                  key={key}
                  onClick={() => { setSelectedType(key); setView('vehiclesByType'); }}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition"
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium">{type.name}</div>
                  <div className="text-xs text-gray-600">{count} engin(s)</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Liste des véhicules
  const VehiclesListView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Engins</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Ajouter un engin
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut ESP32</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière MAJ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vehicles.map(v => {
              const hoursSinceUpdate = (Date.now() - v.lastUpdate) / (1000 * 3600);
              const isStale = hoursSinceUpdate > 24;
              return (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{VEHICLE_TYPES[v.type]?.icon}</span>
                      <div>
                        <div className="font-semibold">{v.name}</div>
                        <div className="text-sm text-gray-600">{v.numero}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{VEHICLE_TYPES[v.type]?.name}</td>
                  <td className="px-6 py-4">
                    {v.espStatus === 'online' ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Wifi size={16} /> En ligne
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <WifiOff size={16} /> Hors ligne
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={isStale ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      {v.lastUpdate.toLocaleString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSelectedVehicle(v); setView('vehicleDetail'); }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Détail d'un véhicule
  const VehicleDetailView = () => {
    if (!selectedVehicle) return null;
    
    const authorizedOps = operators.filter(op => op.caces.includes(selectedVehicle.type));
    const vehicleLogs = logs.filter(l => l.vehicleId === selectedVehicle.id).sort((a, b) => b.timestamp - a.timestamp);

    return (
      <div className="space-y-6">
        <button onClick={() => setView('vehicles')} className="text-blue-600 hover:underline">← Retour</button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">{VEHICLE_TYPES[selectedVehicle.type]?.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{selectedVehicle.name}</h2>
              <p className="text-gray-600">{selectedVehicle.numero} - {VEHICLE_TYPES[selectedVehicle.type]?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Statut ESP32</div>
              <div className="font-semibold">{selectedVehicle.espStatus === 'online' ? '🟢 En ligne' : '🔴 Hors ligne'}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Dernière mise à jour</div>
              <div className="font-semibold">{selectedVehicle.lastUpdate.toLocaleString('fr-FR')}</div>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6">
            <RefreshCw size={18} />
            Synchroniser l'ESP32
          </button>
        </div>

        {/* Intervenants autorisés */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Intervenants autorisés ({authorizedOps.length})</h3>
          <div className="space-y-2">
            {authorizedOps.map(op => {
              const expDate = new Date(op.expirations[selectedVehicle.type]);
              const isExpired = expDate < new Date();
              return (
                <div key={op.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-semibold">{op.name}</div>
                    <div className="text-sm text-gray-600">Badge: {op.badge}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${isExpired ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      CACES expire: {expDate.toLocaleDateString('fr-FR')}
                    </div>
                    {isExpired && <div className="text-xs text-red-600">⚠️ Expiré</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logs d'accès */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Historique d'accès</h3>
          <div className="space-y-2">
            {vehicleLogs.map(log => {
              const op = operators.find(o => o.id === log.operatorId);
              return (
                <div key={log.id} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-gray-400" />
                    <div>
                      <div className="font-medium">{op?.name || 'Inconnu'}</div>
                      <div className="text-sm text-gray-600">{log.action}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {log.timestamp.toLocaleString('fr-FR')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Vue véhicules par type
  const VehiclesByTypeView = () => {
    if (!selectedType) return null;
    const typeInfo = VEHICLE_TYPES[selectedType];
    const filteredVehicles = vehicles.filter(v => v.type === selectedType);

    return (
      <div className="space-y-6">
        <button onClick={() => setView('dashboard')} className="text-blue-600 hover:underline">← Retour</button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">{typeInfo.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{typeInfo.name}</h2>
              <p className="text-gray-600">CACES requis: {typeInfo.caces}</p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredVehicles.map(v => (
              <div key={v.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div>
                  <div className="font-semibold">{v.name}</div>
                  <div className="text-sm text-gray-600">{v.numero}</div>
                </div>
                <button
                  onClick={() => { setSelectedVehicle(v); setView('vehicleDetail'); }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Liste des intervenants
  const OperatorsListView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Intervenants</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Ajouter un intervenant
        </button>
      </div>

      <div className="grid gap-4">
        {operators.map(op => {
          const expiredCaces = op.caces.filter(c => new Date(op.expirations[c]) < new Date());
          return (
            <div key={op.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{op.name}</h3>
                  <p className="text-sm text-gray-600">Badge: {op.badge}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedOperator(op); setView('operatorEdit'); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">CACES:</div>
                <div className="flex flex-wrap gap-2">
                  {op.caces.map(c => {
                    const expDate = new Date(op.expirations[c]);
                    const isExpired = expDate < new Date();
                    return (
                      <div key={c} className={`px-3 py-1 rounded text-sm ${isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {c}
                        <div className="text-xs">{isExpired ? '⚠️ Expiré' : `Expire: ${expDate.toLocaleDateString('fr-FR')}`}</div>
                      </div>
                    );
                  })}
                </div>
                {expiredCaces.length > 0 && (
                  <div className="mt-2 text-sm text-red-600 font-semibold">
                    ⚠️ {expiredCaces.length} CACES expiré(s)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Édition intervenant
  const OperatorEditView = () => {
    if (!selectedOperator) return null;

    return (
      <div className="space-y-6">
        <button onClick={() => setView('operators')} className="text-blue-600 hover:underline">← Retour</button>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Modifier les CACES - {selectedOperator.name}</h2>
          
          <div className="space-y-4">
            {Object.entries(VEHICLE_TYPES).map(([key, type]) => {
              const hasCaces = selectedOperator.caces.includes(key);
              return (
                <div key={key} className="border rounded-lg p-4">
                  <label className="flex items-center gap-3 mb-2">
                    <input type="checkbox" checked={hasCaces} className="w-4 h-4" readOnly />
                    <span className="font-medium">{type.name} ({key})</span>
                  </label>
                  {hasCaces && (
                    <div className="ml-7">
                      <label className="block text-sm text-gray-600 mb-1">Date d'expiration:</label>
                      <input
                        type="date"
                        value={selectedOperator.expirations[key]}
                        className="border rounded px-3 py-2"
                        readOnly
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Enregistrer
            </button>
            <button onClick={() => setView('operators')} className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300">
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">🏗️ Gestion d'Accès Engins - EPR2</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => setView('vehicles')}
              className={`px-4 py-2 rounded ${view === 'vehicles' || view === 'vehicleDetail' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Engins
            </button>
            <button
              onClick={() => setView('operators')}
              className={`px-4 py-2 rounded ${view === 'operators' || view === 'operatorEdit' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Intervenants
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {view === 'dashboard' && <DashboardView />}
        {view === 'vehicles' && <VehiclesListView />}
        {view === 'vehicleDetail' && <VehicleDetailView />}
        {view === 'vehiclesByType' && <VehiclesByTypeView />}
        {view === 'operators' && <OperatorsListView />}
        {view === 'operatorEdit' && <OperatorEditView />}
      </div>
    </div>
  );
}

export default App;
