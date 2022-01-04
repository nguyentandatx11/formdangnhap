// Se sua thanh object Constructor || Doi tuong Validator
function Validator(options) {

    var selectorRules = {}
    
    // Handle validated values
    function validate(inputElement, rule) {
        // Tìm đến phần tử cha trong trường hợp những input không ngang cấp với nhau.
    
        var parentElement = inputElement.closest(options.formGroupSelector);
        var errorElement = parentElement.querySelector(options.errorSelector)
        var errorMessage;
        
        // Lay cac rule cua selector
        var rules = selectorRules[rule.selector]
        // loop rule va check
        for (var i = 0; i < rules.length; ++i) {

            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                    break
                default : 
                    errorMessage = rules[i](inputElement.value)
 
            }
            
            if (errorMessage) break;
        }

            if (errorMessage) {
                errorElement.innerText = errorMessage
                parentElement.classList.add('invalid')
            } else {
                errorElement.innerText = ''  
                parentElement.classList.remove('invalid') 
            }
        return !errorMessage
    }

    // Handle when user start type on error inputElement
    function typeInErrorInput(inputElement) {
        var parentElement = inputElement.closest(options.formGroupSelector);
        var errorElement = parentElement.querySelector(options.errorSelector)
        errorElement.innerText = ''  
        parentElement.classList.remove('invalid') 
    }

    var formElement = document.querySelector(options.form);


    // LOGIC XU LY (HANDLE)
    if (formElement) {
        // when Submit form
        formElement.onsubmit = function(e) {
            e.preventDefault()
            var isFormValid = true
            // Lap qua tung rule va validate when submit
            options.rules.forEach(function(rule) {            
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)

                if (!isValid) {
                    isFormValid = false
                }
            })
            if (isFormValid) {
                // Submit voi JAVSCRIPT
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        
                        switch (input.type) {
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    // values[input.name] = ''
                                    return values 
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)
                                break

                            case 'radio':
                                if(input.matches(':checked')) {
                                    values[input.name] = input.value
                                }   
                                break
                            
                            case 'file': 
                            values[input.name] = input.files
                                break

                            default:
                                values[input.name] = input.value
                        }
                    
                        return values
                    },{})

                    options.onSubmit(formValues)
                }
            } 
            // Submit voi hanh vi mac dinh cua trinh duyet
            else { 
                // formElement.submit()
            }
        }

        options.rules.forEach(function(rule) {
            // Luu lai cac rule trong moi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
            selectorRules[rule.selector] = [rule.test]
            }

            // Lay element cua form can validate
            var inputElements = formElement.querySelectorAll(rule.selector)
            Array.from(inputElements).forEach(inputElement => {
                 // Xu ly truong hop blur khoi inout
                 inputElement.onblur = function() {
                    
                    validate(inputElement, rule)
            
                }
                // Xu ly khi user bat dau nhap.
                inputElement.oninput = function() {
                    typeInErrorInput(inputElement)
                }
            })
        })

    }
}
// Dinh nghia rules
// Nguyen tac cua cac rules:
// 1. Khi co loi thi tra ra message loi
// 2. Khi hop le thi tra ra undefined
Validator.isRequired = function(selector, message) {
    return {
        selector,
        test: function(value) {
            return value ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector,
        test: function(value) {
            const regex =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập đúng email'
        }
    }
}
Validator.minLength = function(selector, min, message) {
    return {
        selector,
        test: function(value) {
            return value.length >=6 ? undefined :   message || `Vui lòng nhập ít nhất ${min} kí tự`
        }
    }
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined :    message || 'Giá trị nhập vào không chính xác'
        }
    }
}