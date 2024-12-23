import { FaExternalLinkAlt } from "react-icons/fa";
import { useActiveHost } from "#/hooks/query/use-active-host";

export function ServedAppLabel() {
  const { activeHost } = useActiveHost();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">App</div>
      {!activeHost && <span className="text-red-500">Offline</span>}
      {activeHost && (
        <a
          href={activeHost}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2"
        >
          <span className="text-green-500">Online</span>
          <div className="flex items-center gap-1">
            <FaExternalLinkAlt fill="#a3a3a3" />
            <code className="text-xs">{activeHost.split(":").pop()}</code>
          </div>
        </a>
      )}
    </div>
  );
}