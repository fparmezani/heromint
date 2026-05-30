'use client';

import { useState, useEffect } from 'react';
import { AppConfig } from '@/lib/config';

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carregar configurações atuais
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: keyof AppConfig, value: any) => {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar configurações</p>
          <button 
            onClick={loadConfig}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">⚙️ Configurações do Sistema</h1>
            <p className="text-gray-600 mt-1">Configure como o HeroMint deve funcionar</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Mensagem de feedback */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Configuração de IA */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">🤖 Geração de Imagens (IA)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Provedor de IA
                  </label>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="aiProvider"
                        value="replicate"
                        checked
                        readOnly
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3">
                        <span className="block text-sm font-medium text-gray-900">
                          🔄 Replicate
                        </span>
                        <span className="block text-sm text-gray-500">
                          Flux.1 Dev - Qualidade alta, mais rápido
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Configurações de Imagem
                  </label>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Número padrão de imagens
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={config.defaultImageCount}
                      onChange={(e) => updateConfig('defaultImageCount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Máximo de imagens por pedido
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={config.maxImageCount}
                      onChange={(e) => updateConfig('maxImageCount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configurações de Funcionalidades */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">🔧 Funcionalidades</h2>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.enableEmailDelivery}
                    onChange={(e) => updateConfig('enableEmailDelivery', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">
                      📧 Entrega por Email
                    </span>
                    <span className="block text-sm text-gray-500">
                      Permite enviar imagens por email
                    </span>
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.enablePayments}
                    onChange={(e) => updateConfig('enablePayments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">
                      💳 Sistema de Pagamentos
                    </span>
                    <span className="block text-sm text-gray-500">
                      Habilita cobrança pelos serviços
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Botão de salvar */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={saveConfig}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  '💾 Salvar Configurações'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
