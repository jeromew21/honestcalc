var nibble_table = {'0000': '0', '0001': '1', '0010': '2', '0011': '3', '0100': '4', '0101': '5', '0110': '6', '0111': '7', '1000': '8', '1001': '9', '1010': 'A', '1011': 'B', '1100': 'C', '1101': 'D', '1110': 'E', '1111': 'F'}
var hex_table = {'0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001', 'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'}

var strip_leading_zeroes = function(input) {
    var result = "";
    var i = 0;
    while (i < input.length) {
        if (input.substring(i, i+1) != "0") {
            break;
        }
        i += 1;
    }
    while (i < input.length) {
        result += input.substring(i, i+1);
        i++;
    }
    if (result == "") {
        result = "0";
    }
    return result;
}

var least_sig = function(value, count) {
    return value.substring(value.length-count, value.length);
}

var change_nothing = function(foo) {
    return foo;
}

var binary_to_hex = function(binary) {
    if (binary == "") {
        return "";
    }
    var result = ""
    binary = strip_leading_zeroes(binary);
    if (binary.length % 4 != 0) {
        binary_padded = "0".repeat(4 - (binary.length % 4)) + binary;
    } else {
        binary_padded = binary;
    }
    for (var i = 0; i < binary_padded.length; i += 4) {
        var substr = binary_padded.substring(i, i + 4);
        if (nibble_table.hasOwnProperty(substr)) {
            result += nibble_table[substr];
        } else {
            console.log("Please enter a valid binary number.");
            return "";
        }
    }
    return strip_leading_zeroes(result);
}

var hex_to_binary = function(hex) {
    if (hex == "") {
        return "";
    }
    var result = "";
    hex = strip_leading_zeroes(hex);
    for (var i = 0; i < hex.length; i += 1) {
        var substr = hex.substring(i, i+1).toUpperCase();
        if (hex_table.hasOwnProperty(substr)) {
            result += hex_table[substr];
        } else {
            console.log("Please enter a valid hex number.");
            return "";
        }
    }
    return strip_leading_zeroes(result);
}

var decimal_to_binary_unsigned = function(decimal) {
    if (decimal == "") {
        return "";
    }
    decimal = strip_leading_zeroes(decimal);
    decimal = parseInt(decimal);
    if (!(decimal >= 0)) {
        return ""
    }
    var result = ""
    var rem;
    while (decimal != 0) {
        rem = "" + decimal % 2;
        decimal = Math.floor(decimal/2);
        result = rem + result;
    }
    return strip_leading_zeroes(result);
}

var binary_to_decimal = function(binary) {
    if (binary == "") {
        return "";
    }
    var n = 0;
    var result = 0;
    for (var i = binary.length - 1; i >= 0; i--) {
        if (binary.charAt(i) == "1") {
            result += Math.pow(2, n);
        }
        n += 1;
    }
    return "" + result;
}

var decimal_to_twos = function(decimal, bits) {
    var original_input = decimal;
    decimal = parseInt(decimal);
    if (isNaN(decimal)) {
        return "";
    }
    if (decimal >= 0) {
        var ans = decimal_to_binary_unsigned(original_input);
        if (ans.length > bits) {
            return least_sig(ans, bits);
        }
        return "0".repeat(bits - ans.length) + ans;
    } else {
        var positive_dec = decimal*-1;
        var binary_rep = decimal_to_binary_unsigned("" + positive_dec);
        //pad
        if (binary_rep.length > bits) {
            binary_rep = least_sig(binary_rep, bits);
        } else {
            binary_rep = "0".repeat(bits - binary_rep.length) + binary_rep;
        }
        var inverted_binary = "";
        for (var i = 0; i < binary_rep.length; i++) {
            if (binary_rep.charAt(i) == "1") {
                inverted_binary += "0";
            } else {
                inverted_binary += "1";
            }
        }
        var added1 = parseInt(binary_to_decimal(inverted_binary)) + 1;
        return least_sig(decimal_to_binary_unsigned("" + added1), bits); //cut off eight places
    }
}

var twos_to_decimal = function(binary, bits) {
    if (binary.length != bits) {
        return "";
    }
    if (binary.charAt(0) == "0") {
        return binary_to_decimal(binary);
    } else {
        var inverted_binary = "";
        for (var i = 0; i < binary.length; i++) {
            if (binary.charAt(i) == "1") {
                inverted_binary += "0";
            } else {
                inverted_binary += "1";
            }
        }
        var added1 = parseInt(binary_to_decimal(inverted_binary)) + 1;
        return "-" + "" + added1;
    }
}
