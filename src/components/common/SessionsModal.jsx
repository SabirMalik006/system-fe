import React, { useState, useEffect, useCallback } from 'react';
import { X, Monitor, Smartphone, MapPin, Clock, LogOut, RefreshCw, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} d ago`;
};

const shortDevice = (userAgent) => {
  if (!userAgent) return 'Unknown device';
  const browser =
    /Edg\//.test(userAgent) ? 'Edge' :
    /Chrome\//.test(userAgent) ? 'Chrome' :
    /Firefox\//.test(userAgent) ? 'Firefox' :
    /Safari\//.test(userAgent) ? 'Safari' :
    'Browser';
  const os =
    /Windows/.test(userAgent) ? 'Windows' :
    /Mac OS/.test(userAgent) ? 'macOS' :
    /Android/.test(userAgent) ? 'Android' :
    /iPhone|iPad/.test(userAgent) ? 'iOS' :
    /Linux/.test(userAgent) ? 'Linux' :
    'Unknown OS';
  return `${browser} on ${os}`;
};

const SessionsModal = ({ open, onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authAPI.getSessions();
      setSessions(res.data.sessions || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) loadSessions();
  }, [open, loadSessions]);

  if (!open) return null;

  const handleTerminate = async (session) => {
    setActionId(session.id);
    try {
      const res = await authAPI.terminateSession(session.id);
      if (res.data.current) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        toast.success('Signed out from this device');
        window.location.href = '/login';
        return;
      }
      toast.success(res.data.message || 'Session terminated');
      loadSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not terminate session');
    } finally {
      setActionId(null);
    }
  };

  const handleLogoutAll = async () => {
    setLoggingOutAll(true);
    try {
      await authAPI.logoutAllSessions();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      toast.success('Signed out from all sessions');
      window.location.href = '/login';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not sign out');
      setLoggingOutAll(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Monitor size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Active Sessions</h2>
            <p className="text-xs text-gray-500">
              Signed-in devices for your account — one active session allowed
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <RefreshCw size={20} className="animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No active sessions found.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`border rounded-lg p-3 ${
                  session.current ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {shortDevice(session.device)}
                      </span>
                      {session.current && (
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                          This device
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[11px] text-gray-500 truncate mt-0.5"
                      title={session.device}
                    >
                      {session.device}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-gray-500">
                      {session.ip && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={11} /> {session.ip}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} /> Last active {timeAgo(session.lastActivityAt)}
                      </span>
                      {/Mobile|Android|iPhone|iPad/i.test(session.device || '') ? (
                        <Smartphone size={11} />
                      ) : null}
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => handleTerminate(session)}
                      disabled={actionId === session.id}
                      className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-60 shrink-0"
                    >
                      {actionId === session.id ? '...' : 'Terminate'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <ShieldAlert size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800">
            Logging in from another device or browser will automatically sign out
            this session. Sessions also expire after 30 minutes of inactivity.
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleLogoutAll}
            disabled={loggingOutAll}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            {loggingOutAll ? 'Signing out...' : 'Sign out everywhere'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionsModal;
