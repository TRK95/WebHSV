# Hồ sơ Sinh viên 5 tốt - implementation notes

## Luồng admin

1. CMS > Sv5t > **Hồ sơ & xét duyệt**.
2. Tạo một đợt xét, chọn thời gian nhận hồ sơ và số hoạt động đã xác minh tối thiểu cho từng tiêu chí.
3. Tạo hoạt động và gắn vào một trong 5 tiêu chí.
   - **AUTO_LIST**: tải CSV có cột `MSSV` (hoặc `studentId`, `studentCode`, `MSV`) và tùy chọn cột `Họ tên`/`fullName`. CSV comma hoặc semicolon đều được hỗ trợ.
   - **MANUAL**: không cần CSV. Sinh viên sẽ nộp PDF minh chứng.
4. Tab **Chờ duyệt** hiển thị minh chứng PDF từ hoạt động manual và hoạt động do sinh viên đề xuất.
5. Admin duyệt/từ chối. Kết quả của hồ sơ đã nộp được tính lại ngay.
6. Tab **Hồ sơ đã nộp** hiển thị trạng thái `Đạt`, `Chờ duyệt`, `Chưa đạt`.

## Luồng sinh viên

- Truy cập `/sinh-vien-5-tot/ho-so` hoặc menu **Nộp hồ sơ Sinh viên 5 tốt**.
- Hệ thống auto-check theo MSSV đăng nhập với các danh sách CSV do admin tải lên.
- Với hoạt động manual, sinh viên bấm **Nộp PDF**.
- Sinh viên có thể **Đề xuất hoạt động khác**, chọn tiêu chí, đơn vị tổ chức, ngày và PDF minh chứng.
- Dashboard có riêng bảng **Hoạt động đang chờ admin kiểm tra**.
- Khi bấm **Nộp / cập nhật hồ sơ**, hệ thống trả ngay trạng thái hiện tại.

## Quy tắc kết quả MVP

Mỗi đợt xét lưu `minVerifiedActivities` cho từng tiêu chí. Một hoạt động được tính khi:

- MSSV có trong CSV của hoạt động `AUTO_LIST`; hoặc
- claim PDF đã được admin duyệt.

Kết quả:

- `PASSED`: tất cả tiêu chí đủ số hoạt động đã xác minh.
- `PENDING`: chưa đủ hoạt động đã xác minh nhưng tất cả phần thiếu đều có claim đang chờ duyệt.
- `NOT_QUALIFIED`: còn ít nhất một tiêu chí chưa đủ và không có đủ claim đang chờ để bù.

Đây là rule engine tối thiểu. Nếu quy chế thực tế có GPA, điểm rèn luyện, chứng chỉ, giải thưởng, số ngày tình nguyện... nên mở rộng `criteria` thành các sub-rule có kiểu dữ liệu riêng thay vì chỉ đếm hoạt động.

## Dữ liệu mới

MongoDB collections:

- `Sv5tCampaign`
- `Sv5tActivity`
- `Sv5tParticipant`
- `Sv5tClaim`
- `Sv5tApplication`

## File minh chứng

PDF SV5T được upload vào `sv5t/evidence/<MSSV>/...` trong Google Cloud Storage và **không gọi `makePublic()`**. API chỉ sinh signed URL 15 phút để sinh viên/admin xem minh chứng. Cần bảo đảm bucket không có bucket-level public ACL/policy.

## Lưu ý triển khai

- Module CMS hiện tại của dự án dùng accessKey theo kiến trúc cũ và nhiều API admin chưa có middleware phân quyền thực sự. Trước khi production, nên thêm middleware xác thực admin cho `/api/sv5t/campaigns`, `/activities`, `/claims`, `/applications`.
- Student endpoints `/api/sv5t/student/*` đã kiểm tra JWT hiện tại của Web app.
- File mẫu: `docs/sv5t_participants_sample.csv`.
