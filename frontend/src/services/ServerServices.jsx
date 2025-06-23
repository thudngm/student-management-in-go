import api from './API.jsx';
import { API_ENDPOINTS } from './API.jsx';

// Dummy data
const studentList = [
    { id: "2211552", name: "Bùi Văn My", dob: "2000-12-29", email: "aaron68@bowman.com", gpa: "2.94" },
    { id: "2211553", name: "Đặng Nhật Trang", dob: "2004-06-13", email: "brocktyrone@hotmail.com", gpa: "3.79" },
    { id: "2211554", name: "Lý Phúc Sơn", dob: "2004-06-30", email: "henrymartin@mcdonald-fox.net", gpa: "3.05" },
    { id: "2211555", name: "Võ Phúc An", dob: "2004-11-05", email: "kristen12@yahoo.com", gpa: "3.77" },
    { id: "2211556", name: "Lý Minh An", dob: "2002-08-30", email: "susan85@harrison.com", gpa: "3.12" },
    { id: "2211557", name: "Phạm Văn Linh", dob: "2005-02-13", email: "carmen67@yahoo.com", gpa: "2.84" },
    { id: "2211558", name: "Hồ Nhật Linh", dob: "2004-09-10", email: "gomezjennifer@hotmail.com", gpa: "2.60" },
    { id: "2211559", name: "Đỗ Ngọc Bình", dob: "2001-01-16", email: "nicolemills@gmail.com", gpa: "2.90" },
    { id: "2211560", name: "Lê Văn An", dob: "2000-11-11", email: "michaelbaker@gmail.com", gpa: "3.26" },
    { id: "2211561", name: "Nguyễn Minh Hải", dob: "2002-07-08", email: "bradleyjackson@yahoo.com", gpa: "3.93" },
    { id: "2211562", name: "Trần Thị My", dob: "2001-01-01", email: "thompsonbrittany@yahoo.com", gpa: "3.67" },
    { id: "2211563", name: "Nguyễn Văn Quỳnh", dob: "2001-08-17", email: "stevenmills@hotmail.com", gpa: "3.53" },
    { id: "2211564", name: "Phạm Hữu Việt", dob: "2003-12-12", email: "robertsjacob@gmail.com", gpa: "2.35" },
    { id: "2211565", name: "Ngô Gia Khang", dob: "2004-03-20", email: "keith41@hotmail.com", gpa: "2.45" },
    { id: "2211566", name: "Dương Nhật Linh", dob: "2003-10-19", email: "victor07@barnes.net", gpa: "2.00" },
    { id: "2211567", name: "Võ Ngọc Oanh", dob: "2000-04-25", email: "kristinestewart@hotmail.com", gpa: "2.53" },
    { id: "2211568", name: "Nguyễn Minh Hải", dob: "2001-03-02", email: "phillip27@mitchell.com", gpa: "3.86" },
    { id: "2211569", name: "Đinh Gia Bình", dob: "2005-05-11", email: "llong@hotmail.com", gpa: "3.97" },
    { id: "2211570", name: "Trần Thị Quỳnh", dob: "2001-05-05", email: "lewissteven@cameron.com", gpa: "2.34" },
    { id: "2211571", name: "Phạm Trọng Phát", dob: "2002-10-10", email: "yvette77@khan.net", gpa: "3.25" },
    { id: "2211572", name: "Nguyễn Ngọc Trang", dob: "2003-06-07", email: "emily82@stephens.com", gpa: "2.47" },
    { id: "2211573", name: "Trịnh Minh Phát", dob: "2002-09-03", email: "cynthiarichardson@gmail.com", gpa: "3.60" },
    { id: "2211574", name: "Hoàng Văn An", dob: "2001-12-19", email: "danielfoster@gmail.com", gpa: "2.42" },
    { id: "2211575", name: "Đỗ Nhật Sơn", dob: "2000-01-24", email: "margaretknight@hotmail.com", gpa: "3.32" },
    { id: "2211576", name: "Phạm Văn Linh", dob: "2000-10-28", email: "sarah16@hampton.com", gpa: "3.74" },
    { id: "2211577", name: "Nguyễn Gia Quỳnh", dob: "2003-06-10", email: "denise72@yahoo.com", gpa: "3.92" },
    { id: "2211578", name: "Bùi Trọng Việt", dob: "2002-07-04", email: "williamswarren@gmail.com", gpa: "2.67" },
    { id: "2211579", name: "Ngô Ngọc Trang", dob: "2003-08-16", email: "ashley91@gmail.com", gpa: "3.04" },
    { id: "2211580", name: "Đặng Hữu Khang", dob: "2002-10-01", email: "shelly19@gmail.com", gpa: "2.91" },
    { id: "2211581", name: "Hồ Minh My", dob: "2001-09-06", email: "turnerjonathan@hotmail.com", gpa: "3.41" },
    { id: "2211582", name: "Trần Ngọc Bình", dob: "2003-11-14", email: "morrisken@hotmail.com", gpa: "3.87" },
    { id: "2211583", name: "Võ Minh Hải", dob: "2001-03-09", email: "alvinlong@hotmail.com", gpa: "3.17" },
    { id: "2211584", name: "Phạm Hữu Quỳnh", dob: "2004-01-06", email: "crystalrodriguez@yahoo.com", gpa: "3.28" },
    { id: "2211585", name: "Nguyễn Văn Bình", dob: "2002-06-30", email: "cherylnichols@gmail.com", gpa: "2.98" },
    { id: "2211586", name: "Lê Nhật Trang", dob: "2003-04-26", email: "bradley14@stokes.com", gpa: "3.44" },
    { id: "2211587", name: "Hoàng Gia Hải", dob: "2000-09-25", email: "brittanyclark@hotmail.com", gpa: "2.80" },
    { id: "2211588", name: "Đinh Phúc Việt", dob: "2004-02-12", email: "stacey04@perkins.com", gpa: "3.68" },
    { id: "2211589", name: "Nguyễn Minh An", dob: "2003-05-22", email: "charlesmcguire@hotmail.com", gpa: "2.50" },
    { id: "2211590", name: "Trịnh Văn Khang", dob: "2002-03-23", email: "nicholelong@wells.com", gpa: "3.00" },
    { id: "2211591", name: "Ngô Ngọc My", dob: "2000-01-18", email: "frederick90@pope.com", gpa: "2.71" },
    { id: "2211592", name: "Phạm Trọng Quỳnh", dob: "2004-10-07", email: "vincentgilbert@gmail.com", gpa: "3.30" },
    { id: "2211593", name: "Nguyễn Văn Hải", dob: "2002-06-15", email: "hilljoann@hotmail.com", gpa: "3.75" },
    { id: "2211594", name: "Lê Thị Trang", dob: "2000-04-13", email: "rebeccabutler@rodriguez.biz", gpa: "3.10" },
    { id: "2211595", name: "Hoàng Gia Hải", dob: "2001-07-17", email: "ryan07@jenkins-murillo.com", gpa: "2.77" }
];

// Lấy danh sách SV
export const getStudentList = async () => {
    try {
        return await api.get(API_ENDPOINTS.STUDENTS.BASE);
    } catch (error) {
        throw new Error(`Failed to fetch student list (${error.message})`);
    }
    // return studentList; // Trả về dữ liệu giả lập
};

// Lấy thông tin SV theo ID
export const getStudent = async (id) => {
    try {
        return await api.get(API_ENDPOINTS.STUDENTS.BY_ID(id));
    } catch (error) {
        throw new Error(`Failed to fetch student with ID ${id} (${error.message})`);
    }
};

// Tạo mới SV
export const createStudent = async (student) => {
    try {
        return await api.post(API_ENDPOINTS.STUDENTS.BASE, student);
    } catch (error) {
        throw new Error(`Failed to create student ${student.name} (${error.message})`);
    }
};

// Cập nhật SV theo ID
export const updateStudent = async (id, student) => {
    try {
        return await api.put(API_ENDPOINTS.STUDENTS.BY_ID(id), student);
    } catch (error) {
        throw new Error(`Failed to update student with ID ${id} (${error.message})`);
    }
};

// Xóa SV theo ID
export const deleteStudent = async (id) => {
    try {
        const response = await api.delete(API_ENDPOINTS.STUDENTS.BY_ID(id), {
            withCredentials: true
        });
        console.log(`Deleted student with ID ${id}:`, response);
    } catch (error) {
        console.error(`Error deleting student with ID ${id}:`, error);
        throw new Error(`Failed to delete student with ID ${id} (${error.message})`);
    }
};