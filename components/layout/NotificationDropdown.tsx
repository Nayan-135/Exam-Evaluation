"use client";

interface Notification {
  id: string;
  title: string;
  message: string;
}

interface Props {
  notifications: Notification[];
}

export default function NotificationDropdown({
  notifications,
}: Props) {
  return (
    <div className="absolute right-0 top-12 w-96 bg-white border rounded-xl shadow-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">
          Notifications
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">
            No Notifications
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-4 border-b hover:bg-gray-50"
            >
              <h4 className="font-medium">
                {n.title}
              </h4>

              <p className="text-sm text-gray-500">
                {n.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}