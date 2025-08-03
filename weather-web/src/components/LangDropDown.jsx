import React from 'react'
import { useTranslation } from 'react-i18next'

function LangDropDown() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div>
      <select className="form-select button-secondary" onChange={(e) => changeLanguage(e.target.value)}>
        <option className="tx-black" value="en">English</option>
        <option className="tx-black" value="es">Español</option>
        <option className="tx-black" value="fr">Français</option>
      </select>
    </div>
  )
}

export default LangDropDown
