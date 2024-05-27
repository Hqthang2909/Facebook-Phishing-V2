import { faTable } from "@fortawesome/free-solid-svg-icons/faTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import copy from "copy-to-clipboard";
import { useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import Poster from "/poster.ico";
interface UserData {
  [key: string]: {
    cookie: null | string;
    country: null | string;
    password: string;
    type: string;
    username: string;
  };
}
type Key = "cookie" | "country" | "password" | "type" | "username";
const Data = () => {
  const [dataList, setDataList] = useState<UserData>({});
  const [sortedKeys, setSortedKeys] = useState<string[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const [tableSize, setTableSize] = useState(0);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    null | UserData[keyof UserData]
  >(null);
  const [selectedItemToContextMenu, setSelectedItemToContextMenu] = useState<
    null | UserData[keyof UserData]
  >(null);
  const [id, setId] = useState<keyof UserData>("");
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<number | null>(null);

  const getData = async () => {
    try {
      const res = await axios.get("/api/get-data");
      setDataList(res.data);
      setSortedKeys(Object.keys(res.data));
      if (Object.keys(res.data).length === 0) {
        setShowTable(false);
      } else {
        setShowTable(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        handleCloseContextMenu();
      }
    };
    if (showTable) {
      setTableSize(tableRef.current?.getBoundingClientRect().width || 0);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTable]);

  const sortTable = (key: keyof UserData) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    const sortedData = [...sortedKeys].sort((a, b) => {
      if (key === "id") {
        return direction === "ascending"
          ? parseInt(a) - parseInt(b)
          : parseInt(b) - parseInt(a);
      }

      const valueA = dataList[a][key as Key];
      const valueB = dataList[b][key as Key];

      if (valueA === null && valueB === null) return 0;
      if (valueA === null) return direction === "ascending" ? 1 : -1;
      if (valueB === null) return direction === "ascending" ? -1 : 1;
      if (key === "cookie") {
        if (valueA.length < valueB.length)
          return direction === "ascending" ? -1 : 1;
        if (valueA.length > valueB.length)
          return direction === "ascending" ? 1 : -1;
        return 0;
      }
      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setSortedKeys(sortedData);
    setSortConfig({
      key: key as string,
      direction: direction as "ascending" | "descending",
    });
  };

  const handleRowClick = (
    item: UserData[keyof UserData],
    key: keyof UserData,
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => {
    setId(key);
    if (e.button === 2) {
      setSelectedItemToContextMenu(item);
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
    } else {
      setSelectedItem(item);
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLTableSectionElement, MouseEvent>,
  ) => {
    e.preventDefault();
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition({ x: 0, y: 0 });
  };

  const handleDelete = async () => {
    const res = await axios.post("/api/delete-data", {
      id: id,
    });
    if (res.status === 200) {
      toast.success("Đã xóa!");
    }
    getData();
    handleCloseContextMenu();
  };

  const handleCopy = () => {
    const username = selectedItemToContextMenu?.username || "";
    const password = selectedItemToContextMenu?.password || "";
    const cookie = selectedItemToContextMenu?.cookie || "";
    const dataToCopy = `${username}|${password}|${cookie}`;
    copy(dataToCopy);
    handleCloseContextMenu();
    toast.success("Đã sao sao chéo vào Clipboard!");
  };

  const handleTouchStart = (
    item: UserData[keyof UserData],
    key: keyof UserData,
    e: React.TouchEvent<HTMLTableRowElement>,
  ) => {
    setId(key);
    setSelectedItemToContextMenu(item);
    touchTimeoutRef.current = window.setTimeout(() => {
      setContextMenuPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="UTF-8" />
        <link rel="shortcut icon" href={Poster} type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Data</title>
      </Helmet>
      <div
        className={`flex ${showTable ? "h-full" : ""} touch-auto flex-col items-center justify-start overflow-auto p-2`}
      >
        {showTable ? (
          <>
            <b className="mb-2 select-none text-3xl text-indigo-500 md:hover:text-indigo-800">
              <FontAwesomeIcon icon={faTable} /> Data
            </b>
            <table ref={tableRef} className="table w-11/12 text-center">
              <thead>
                <tr>
                  <th onClick={() => sortTable("id")}>ID</th>
                  <th onClick={() => sortTable("username")}>Tài khoản</th>
                  <th onClick={() => sortTable("password")}>Mật khẩu</th>
                  <th onClick={() => sortTable("type")}>Loại</th>
                  <th onClick={() => sortTable("cookie")}>Cookie</th>
                  <th onClick={() => sortTable("country")}>Quốc gia</th>
                </tr>
              </thead>
              <tbody onContextMenu={handleContextMenu}>
                {sortedKeys.map((key) => (
                  <tr
                    key={key}
                    onClick={(e) => handleRowClick(dataList[key], key, e)}
                    onContextMenu={(e) => handleRowClick(dataList[key], key, e)}
                    onTouchStart={(e) =>
                      handleTouchStart(dataList[key], key, e)
                    }
                    onTouchEnd={handleTouchEnd}
                  >
                    <td
                      className="truncate font-bold"
                      style={{ maxWidth: tableSize / 20 }}
                    >
                      {key}
                    </td>
                    <td
                      className="truncate"
                      style={{ maxWidth: tableSize / 5 }}
                    >
                      {dataList[key].username}
                    </td>
                    <td
                      className="truncate"
                      style={{ maxWidth: tableSize / 5 }}
                    >
                      {dataList[key].password}
                    </td>
                    <td
                      className="truncate font-bold"
                      style={{ maxWidth: tableSize / 20 }}
                    >
                      {dataList[key].type}
                    </td>
                    <td
                      className="truncate"
                      style={{ maxWidth: (tableSize / 100) * 25 }}
                    >
                      {dataList[key].cookie}
                    </td>
                    <td
                      className="truncate font-bold"
                      style={{ maxWidth: tableSize / 20 }}
                    >
                      {dataList[key].country}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="flex w-11/12 items-center justify-center">
            <p className="text-center text-2xl font-bold">Không có dữ liệu</p>
          </div>
        )}
        {selectedItem && (
          <Modal data={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
        {contextMenuPosition.x !== 0 && (
          <div
            ref={contextMenuRef}
            className="fixed rounded-lg border border-gray-200 bg-white shadow-md"
            style={{
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
            }}
          >
            <ul>
              <li
                className="cursor-pointer rounded-t-lg border-b border-b-indigo-400 p-2 text-center font-bold hover:border-b-red-500 hover:bg-red-500 hover:text-white"
                onClick={handleDelete}
              >
                Xóa
              </li>
              <li
                className="cursor-pointer rounded-b-lg p-2 text-center font-bold hover:bg-indigo-500 hover:text-white"
                onClick={handleCopy}
              >
                Sao chép
              </li>
            </ul>
          </div>
        )}{" "}
        <ToastContainer />
      </div>
    </HelmetProvider>
  );
};

export default Data;
