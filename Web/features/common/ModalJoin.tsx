import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"

function ModalJoin({ title, handleCancel, handleSubmit, open, value, isJoinClub, handleChange }:
    { title?: string, handleCancel?: () => void, handleSubmit?: () => void, open?: boolean, value?: string, isJoinClub?: boolean, handleChange?: Function }
) {
    return (
        <Dialog
            sx={{
                '.MuiPaper-root': {
                    width: '70%'
                }
            }}
            open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    id="filled-multiline-static"
                    label="Thông tin cơ bản"
                    multiline
                    rows={4}
                    defaultValue={value}
                    variant="outlined"
                    fullWidth
                    onChange={e => handleChange(e.target.value)}
                    sx={{ marginTop: '10px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button onClick={handleSubmit}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ModalJoin