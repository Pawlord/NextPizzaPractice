import React from "react"
import { WhiteBlock } from "../white-block"
import { FormTextarea } from "../form"
import { AdressInput } from "../adress-input"
import { Controller, useFormContext } from "react-hook-form"
import { ErrorText } from "../error-text"

interface Props{
    className?: string,
}


export const CheckoutAdressForm:React.FC<Props> = ({className}) => {

    const {control} = useFormContext();

    return(
        <WhiteBlock title="3. Адрес доставки" className={className}>
            <div className="flex flex-col gap-5">
                {/* Такая обработка рендера инпута нужна если инпут не собственный, с которым можно напрямую работать */}
                {/* А из какой то библиотеки, грубо говоря с помощью control для этого поля */}
                {/* Создается поле (field оболочка), с которй происходят все изменения и отслеживание */}
                <Controller
                    control={control}
                    name="adress"
                    render={({field, fieldState}) => <>
                        <AdressInput onChange={field.onChange} />
                        {fieldState.error?.message && <ErrorText text={fieldState.error.message} />}
                    </> }
                />
                
                <FormTextarea
                    name="comment"
                    className="text-base"
                    placeholder="Комментарий к заказу..."
                    rows={5}    
                />
            </div>
        </WhiteBlock>
    )
}