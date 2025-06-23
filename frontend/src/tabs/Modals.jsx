import { useState, useEffect } from "react";

const StudentModal = ({ student, onClose, onSave }) => {
    // Đóng pop-up khi nhấn ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        dob: "",
        email: "",
        gpa: 0
    });

    // Khởi tạo form với dữ liệu của sinh viên nếu có
    useEffect(() => {
        if (student) {
            setFormData({
                id: student.id || 0,
                name: student.name || "",
                dob: student.dob || "",
                email: student.email || "",
                gpa: student.gpa || ""
            });
        } else {
            // Nếu không có sinh viên, đặt form về mặc định
            setFormData({
                id: 0,
                name: "",
                dob: "",
                email: "",
                gpa: ""
            });
        }
    }, [student]);

    // Xử lý thay đổi input
    const handleChange = (e, isString = true) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: isString ? value : Number(value)
        }));
    };

    const [nameAlert, setNameAlert] = useState("");
    const [emailAlert, setEmailAlert] = useState("");
    const [gpaAlert, setGpaAlert] = useState("");
    const [dobAlert, setDobAlert] = useState("");

    // Xử lý gửi form
    const handleSubmit = (e) => {
        e.preventDefault();
        setNameAlert("");
        setEmailAlert("");
        setGpaAlert("");
        setDobAlert("");

        // Kiểm tra dữ liệu trước khi lưu
        if (!formData.name.trim()) {
            alert("Vui lòng nhập họ tên.");
            return;
        } else {
            // Kiểm tra số, ký tự đặc biệt trong họ tên
            const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/u;

            if (!nameRegex.test(formData.name)) {
                setNameAlert("Họ tên không được chứa số hoặc ký tự đặc biệt.");
                return;
            }
        }

        if (!formData.dob.match(/^\d{4}-\d{2}-\d{2}$/)) {
            alert("Ngày sinh không hợp lệ. Định dạng phải là yyyy-mm-dd.");
            return;
        } else {
            //  Kiểm tra ngày sinh nằm trong khoảng từ 1990 đến 2007
            const dobDate = new Date(formData.dob);
            const minDob = new Date("1990-01-01"); 
            const today = new Date();
            const maxDob = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());

            if (dobDate < minDob || dobDate > maxDob) {
                setDobAlert("Sinh viên phải trên 15 tuổi.");
                return;
            }
        }

        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setEmailAlert("Email không hợp lệ.");
            return;
        }

        if (isNaN(formData.gpa) || formData.gpa < 0.1 || formData.gpa > 4) {
            setGpaAlert("GPA phải là số từ 0.1 đến 4.");
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-blue-300/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {student?.id ? "Sửa thông tin sinh viên" : "Thêm sinh viên mới"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {student?.id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">MSSV</label>
                                <input
                                    type="number"
                                    value={formData.id}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Vd: Nguyễn Văn A"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {nameAlert && <p className="text-red-500 text-sm mt-1">{nameAlert}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                placeholder="DD/MM/YYYY"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {dobAlert && <p className="text-red-500 text-sm mt-1">{dobAlert}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Vd: something@example.com"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {emailAlert && <p className="text-red-500 text-sm mt-1">{emailAlert}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                            <input
                                type="number" step="0.01"
                                name="gpa"
                                value={formData.gpa}
                                onChange={(e) => handleChange(e, false)}
                                placeholder="Range: 0.1 - 4.0"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {gpaAlert && <p className="text-red-500 text-sm mt-1">{gpaAlert}</p>}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmationModal = ({ student, onClose, onConfirm }) => {
    // Đóng pop-up khi nhấn ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-blue-300/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-600">Xác nhận xóa</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-700">
                        Bạn có chắc chắn muốn xóa sinh viên này không?
                    </p>
                    <p>Sinh viên: <span className="font-semibold">{student?.name}</span> - <span className="font-semibold">{student?.id}</span></p>
                    <p>Email: <span className="font-semibold">{student?.email}</span></p>
                    <p className="text-red-500 mt-2">Hành động này không thể hoàn tác!</p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Xác nhận xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export { StudentModal, DeleteConfirmationModal };
