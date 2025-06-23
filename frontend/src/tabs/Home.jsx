import { useState, useMemo, useEffect, useCallback } from "react";
import { StudentModal, DeleteConfirmationModal } from "./Modals";
import {
    getStudentList,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} from "../services/ServerServices.jsx";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const itemsPerPage = 10;

const TableBody = ({ data, onEdit, onDelete }) => {
    return (
        <tbody>
            {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100 transition-colors">
                    <td className="border border-gray-300 p-2 text-center">{item.id}</td>
                    <td className="border border-gray-300 p-2 text-nowrap">{item.name}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.dob}</td>
                    <td className="border border-gray-300 p-2">{item.email}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.gpa}</td>
                    <td className="border border-gray-300 p-2 flex flex-wrap gap-2 md:justify-around justify-center">
                        <button
                            className="bg-orange-500 hover:bg-orange-300 text-white px-2 py-1 rounded"
                            onClick={() => onEdit(item)}
                        >
                            <AiFillEdit className="text-lg" />
                        </button>
                        <button
                            className="bg-red-600 hover:bg-red-300 text-white px-2 py-1 rounded"
                            onClick={() => onDelete(item)}
                        >
                            <AiFillDelete className="text-lg" />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

function usePagination(data, itemsPerPage) {
    // Đọc từ localStorage, mặc định là 1 nếu không có
    const savedPage = parseInt(localStorage.getItem("studentPage")) || 1;
    const [currentPage, setCurrentPage] = useState(savedPage);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            localStorage.setItem("studentPage", pageNumber); // Lưu lại
        }
    };

    // Nếu data thay đổi mà page hiện tại không còn hợp lệ (ví dụ bị xóa dữ liệu)
    useEffect(() => {
        if (currentPage > totalPages) {
            goToPage(1);
        }
    }, [totalPages]);

    return { currentPage, totalPages, currentData, goToPage };
}


function handleData() {
    const [displayData, setDisplayData] = useState([]);
    const [editData, setEditData] = useState(null);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [createData, setCreateData] = useState(null);


    // Lấy danh sách sinh viên từ server khi component mount
    useEffect(() => {
        const fetchStudentList = async () => {
            try {
                const data = await getStudentList();
                setDisplayData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudentList();
    }, []);

    // Xử lý thêm mới SV
    const handleCreate = async (studentData) => {
        try {
            const newStudent = await createStudent(studentData);
            setDisplayData([...displayData, newStudent]);
            setCreateData(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // Xử lý lưu dữ liệu sinh viên (thêm/sửa)
    const handleUpdate = async (studentData) => {
        try {
            // Cập nhật SV đã tồn tại
            const updatedStudent = await updateStudent(studentData.id, studentData);
            setDisplayData(displayData.map(s =>
                s.id === updatedStudent.id ? updatedStudent : s
            ));
            setEditData(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // Xử lý xóa sinh viên
    const handleDelete = async () => {
        if (!studentToDelete || !studentToDelete.id) {
            console.error('Dữ liệu truyền không hợp lệ:', studentToDelete);
            return;
        }
        try {
            await deleteStudent(studentToDelete.id);
            setDisplayData(displayData.filter(s => s.id !== studentToDelete.id));
            setStudentToDelete(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // Xử lý tìm kiếm sinh viên
    const handleSearch = useCallback(async (data) => {
        if (!data) {
            // Nếu search term rỗng, lấy lại toàn bộ danh sách
            try {
                setSearchLoading(true);
                const data = await getStudentList();
                setDisplayData(data);
                setSearchError(null);
            } catch (err) {
                setSearchError(err.message);
            } finally {
                setSearchLoading(false);
            }
            return;
        }

        try {
            setSearchLoading(true);
            const student = await getStudent(data);
            setDisplayData(student ? student : []);
            setSearchError(null);
        } catch (err) {
            setSearchError(err.message);
            setDisplayData([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Debounce tìm kiếm để tránh gọi API liên tục
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchTerm);
        }, 500); // 500ms debounce time

        return () => clearTimeout(timer);
    }, [searchTerm, handleSearch]);

    // Sử dụng hook phân trang
    const { currentPage, totalPages, currentData, goToPage } = usePagination(displayData, itemsPerPage);

    // Hiển thị thông báo khi không có dữ liệu
    if (loading) return (
        <div className="flex items-center justify-center h-[70vh] p-[10px]">
            Loading...
        </div>
    );
    if (error) return (
        <div className="flex items-center justify-center text-red-600 text-2xl h-[70vh] p-[10px]">
            Error: {error}
        </div>
    );

    return (
        <>
            {/* Ô tìm kiếm */}
            <div className="w-full px-3 my-2">
                {/* Thao tác */}
                <div className="w-full flex flex-wrap gap-3 sm:justify-between justify-center my-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sinh viên"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="md:w-4/6 sm:w-1/3 w-5/6 border border-gray-300 rounded px-3 py-2 "
                    />
                    <button
                        className="md:w-1/6 sm:w-1/3 w-5/6 bg-blue-600 hover:bg-blue-300 text-white px-4 py-2 rounded"
                        onClick={() => setCreateData({})}
                    >
                        Thêm sinh viên
                    </button>
                </div>
                {searchLoading && (
                    <p className="text-sm text-gray-500 text-center mt-1">Đang tìm kiếm...</p>
                )}
                {searchError && (
                    <p className="text-sm text-red-500 text-end mt-1">{searchError}</p>
                )}
            </div>
            {/* Số lượng SV trong danh sách */}
            <div className="w-full px-3">
                <p className="text-sm text-gray-500 my-2 px-3">Danh sách có: <strong>{displayData.length}</strong> sinh viên</p>
            </div>

            {/* Hiển thị khi không tìm thấy kết quả */}
            {displayData.length === 0 && searchTerm && !searchLoading && (
                <div className="flex items-center justify-center text-gray-500 text-lg h-[50vh] p-[10px]">
                    Không tìm thấy sinh viên!
                </div>
            )}

            {/* Bảng danh sách sinh viên */}
            {displayData.length > 0 && (
                <>
                    <div className="w-full overflow-x-auto px-3">
                        <table className="w-full table-auto border-collapse border border-gray-400">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-2">MSSV</th>
                                    <th className="border border-gray-300 p-2">Họ tên</th>
                                    <th className="border border-gray-300 p-2">Ngày sinh</th>
                                    <th className="border border-gray-300 p-2">Email</th>
                                    <th className="border border-gray-300 p-2">GPA</th>
                                    <th className="border border-gray-300 p-2">Hành động</th>
                                </tr>
                            </thead>
                            <TableBody
                                data={currentData}
                                onEdit={setEditData}
                                onDelete={setStudentToDelete}
                            />
                        </table>
                    </div>

                    {/* Pagination controls */}
                    <div className="mt-4 flex gap-2 items-center justify-center w-full text-sm">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 border rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-100"
                                }`}
                        >
                            Previous
                        </button>

                        {/* Always show first page */}
                        <button
                            onClick={() => goToPage(1)}
                            className={`px-3 py-1 border rounded-md ${currentPage === 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            1
                        </button>

                        {/* Show ellipsis if current page is far from start */}
                        {currentPage > 3 && <span className="px-2">...</span>}

                        {/* Show pages around current page */}
                        {Array.from({ length: Math.min(5, totalPages - 2) }, (_, i) => {
                            const page = Math.max(2, Math.min(currentPage - 2, totalPages - 5)) + i;
                            if (page > 1 && page < totalPages) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-1 border rounded-md ${currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            }
                            return null;
                        })}

                        {/* Show ellipsis if current page is far from end */}
                        {currentPage < totalPages - 2 && <span className="px-2">...</span>}

                        {/* Always show last page if there's more than 1 page */}
                        {totalPages > 1 && (
                            <button
                                onClick={() => goToPage(totalPages)}
                                className={`px-3 py-1 border rounded-md ${currentPage === totalPages
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {totalPages}
                            </button>
                        )}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-100"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {/* Modal for adding student */}
            {createData && (
                <StudentModal
                    student={createData}
                    onClose={() => setCreateData(null)}
                    onSave={handleCreate}
                />
            )}

            {/* Modal for editing student */}
            {editData && (
                <StudentModal
                    student={editData}
                    onClose={() => setEditData(null)}
                    onSave={handleUpdate}
                />
            )}

            {/* Modal for deleting student */}
            {studentToDelete && (
                <DeleteConfirmationModal
                    student={studentToDelete}
                    onClose={() => setStudentToDelete(null)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );

}

function Home() {
    return (
        <div className="flex flex-wrap md:w-5/6 items-center justify-center mx-auto">
            <h1 className="w-full text-xl text-center font-bold my-5">DANH SÁCH SINH VIÊN</h1>
            {/* <p className="text-lg">Chào mừng bạn đến với hệ thống quản lý sinh viên!</p> */}

            {handleData()}

        </div>
    );
}

export default Home;
