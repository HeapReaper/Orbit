"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "info";

interface Notification {
  id: number;
  title: string;
  description?: string;
  type: NotificationType;
}

interface NotificationContextProps {
  notify: (title: string, description?: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: ProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (title: string, description?: string, type: NotificationType = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000); // auto dismiss after 5s
  };

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />;
      case "info":
      default:
        return <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />;
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            role="alert"
            className="rounded-md border border-gray-300 backdrop-blur-md p-4 shadow-sm flex items-start gap-4"
            style={{ borderColor: "rgba(255, 255, 255, 0.2)" }} // zachtere rand
          >
            {getIcon(n.type)}

            <div className="flex-1">
              <strong className="font-medium text-white">{n.title}</strong>
              {n.description && (
                <p className="mt-0.5 text-sm text-gray-200">{n.description}</p>
              )}
            </div>

            <button
              className="-m-3 rounded-full p-1.5 text-gray-200 transition-colors hover:bg-white/20 hover:text-white"
              onClick={() => dismiss(n.id)}
              aria-label="Dismiss alert"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

    </NotificationContext.Provider>
  );
};
