import React, { useCallback, useMemo } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Row.css'
import { ListRowItem } from './RowItem'

export const ListRow = ({ item, onDelete, name, fields = ['id'], showDelete = false, onEdit, getEditLink }) => {
  const doEdit = useCallback(() => {
    if (onEdit) onEdit(item)
  }, [item, onEdit])

  const editLink = useMemo(() => {
    if (getEditLink) return getEditLink(item)
    else return `/user/${name.toLowerCase()}/${item.id}`
  }, [name, item, getEditLink])

  return (
    <React.Fragment>
      <tr>
        <td className="id">{onEdit ? <span role={'link'} tabIndex={0} onKeyPress={()=>{}} onClick={doEdit}>{item.id}</span> : <Link to={editLink}>{item.id}</Link>}</td>
        {fields.map(
          (field) =>
            field !== 'id' && (
              <td>
                <ListRowItem item={item} field={field} />
              </td>
            ),
        )}
        {item.user && <td>{item.user.email}</td>}

        {showDelete && (
          <td className="right">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(item)
              }}
            >
              delete
            </Button>
          </td>
        )}
      </tr>
    </React.Fragment>
  )
}
