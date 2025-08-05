import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

function SavedLocationCard({ name, weather, temperature, onDelete }) {

    const { t } = useTranslation()

    return (
        <div className="p-3 rounded-3 background-secondary position-relative">
            <div className="row">
                <div className="col-7 d-flex flex-column justify-content-center">
                    <h4 className="tx-secondary text-center mb-1 fw-light">
                        {name}
                    </h4>
                    <h6 className="tx-secondary text-center mb-0 text-uppercase">
                        {weather}
                    </h6>
                </div>
                <div className="col-4 d-flex align-items-center justify-content-center">
                    <h2 className="tx-primary mb-0 fw-light">
                        {temperature}
                    </h2>
                </div>
                {onDelete && (
                <div className='col-1 d-flex align-items-center justify-content-end p-2'>
                    <button 
                        className="btn btn-sm btn-danger m-2"
                        onClick={onDelete}
                        title={t('delete_location')}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>   
                )}
            </div>
        </div>
    );
}

export default SavedLocationCard;