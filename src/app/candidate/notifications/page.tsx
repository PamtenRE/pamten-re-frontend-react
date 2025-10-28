"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    if (user?.role?.toLowerCase() !== "candidate") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Load notifications from localStorage
  useEffect(() => {
    if (user?.userId) {
      const notificationsKey = `notifications_${user.userId}`;
      const stored = localStorage.getItem(notificationsKey);
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to load notifications", e);
        }
      }
    }
  }, [user?.userId]);

  // Mark notification as read
  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);

    if (user?.userId) {
      localStorage.setItem(
        `notifications_${user.userId}`,
        JSON.stringify(updated)
      );
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);

    if (user?.userId) {
      localStorage.setItem(
        `notifications_${user.userId}`,
        JSON.stringify(updated)
      );
    }
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);

    if (user?.userId) {
      localStorage.setItem(
        `notifications_${user.userId}`,
        JSON.stringify(updated)
      );
    }
  };

  // Clear all notifications
  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
      if (user?.userId) {
        localStorage.removeItem(`notifications_${user.userId}`);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700";
      case "info":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700";
      case "error":
        return "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "🔔";
    }
  };

  if (!isAuthenticated || !user || user?.role?.toLowerCase() !== "candidate") {
    return null;
  }

  return (
    <>
      <CandidateSidebar />

      <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 pt-20 md:pl-48 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${
                        unreadCount > 1 ? "s" : ""
                      }`
                    : "All caught up!"}
                </p>
              </div>

              {notifications.length > 0 && (
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-sm border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No notifications yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll notify you when there's something new
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative glass rounded-xl p-6 border-l-4 transition-all duration-300 ${getTypeStyles(
                    notification.type
                  )} ${!notification.read ? "shadow-lg" : "opacity-75"}`}
                  onClick={() =>
                    !notification.read && markAsRead(notification.id)
                  }
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-3xl flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete notification"
                        >
                          ×
                        </button>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
