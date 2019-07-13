Function Encode: String(place#, percentile: Float)
    Select place
        Case 1
            Return place + "st " + percentile + "%"
        Case 2
            Return place + "nd " + percentile + "%"
        Case 3
            Return place + "rd " + percentile + "%"
    End

    Return place + "th " + percentile + "%"
End