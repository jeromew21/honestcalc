Decimal.set({ precision: 20, rounding: 8 })

var nibble_table = {'0000': '0', '0001': '1', '0010': '2', '0011': '3', '0100': '4', '0101': '5', '0110': '6', '0111': '7', '1000': '8', '1001': '9', '1010': 'A', '1011': 'B', '1100': 'C', '1101': 'D', '1110': 'E', '1111': 'F'}
var hex_table = {'0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001', 'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'}

var strip_leading_zeroes = function(input) {
    if (input == undefined) { return "" }
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
        } else if (binary.charAt(i) != "0") {
            return "";
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
        var result = decimal_to_binary_unsigned("" + added1), bits;
        if (result.length > bits) {
            return least_sig(result, bits);
        }
        return "0".repeat(bits - result.length) + result;
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

class ConversionComponent {
    constructor(list_of_types, funcs, title) {
        this.types = list_of_types;
        this.idPrefix = Math.random().toString(36).substring(2);
        this.funcs = funcs;
        this.title = "<h3>" + title + "</h3>\n<p>" + this.types.join(" &#8596; ") + "</p>";
    }

    mount() {
        var self = this;
        var html = '<div class="calc">' + this.title;
        for (var i in this.types) {
            var elemId = this.idPrefix + i;
            html += '<div><input type="text" class="' + this.idPrefix + '" id="' + elemId + '"> ' + this.types[i] + "</div>";
            (function() {
                var k = i;
                $("#content").on("input", "#" + elemId, function() {
                    var myValue = this.value;
                    var funcs = self.funcs[k];
                    var fi = 0;
                    var inputElems = $("." + self.idPrefix);
                    for (var m = 0; m < inputElems.length; m++) {
                        if (inputElems[m].id != self.idPrefix + k) {
                            var convertedValue = funcs[fi](myValue);
                            $("body").find("#" + inputElems[m].id).val(convertedValue);
                            fi += 1;
                        }
                    }
                });
            })(); //must call to preserve frame
        }
        html += "</div>"
        $("#content").append(html);
    }
}

var usign = new ConversionComponent(["Hexadecimal", "Binary (unsigned)", "Decimal"], [
    [hex_to_binary, function(hex) { return binary_to_decimal(hex_to_binary(hex)); }],
    [binary_to_hex, binary_to_decimal],
    [function(decimal) { return binary_to_hex(decimal_to_binary_unsigned(decimal)); }, decimal_to_binary_unsigned],
], "Unsigned Integer Representation");

var twos = new ConversionComponent(["Hexadecimal", "Binary (Two's Complement)", "Decimal"], [
    [function(hex) {
        if (hex == "") {
            return ""
        }
        var binary_rep = hex_to_binary(hex);
        if (binary_rep == "") {
            return ""
        }
        if (binary_rep.length > 8) {
            binary_rep = least_sig(binary_rep, 8);
        } else {
            binary_rep = "0".repeat(8 - binary_rep.length) + binary_rep;
        }
        return binary_rep; 
    }, function(hex) {
        if (hex == "") {
            return ""
        }
        var binary_rep = hex_to_binary(hex);
        if (binary_rep == "") {
            return ""
        }
        if (binary_rep.length > 8) {
            binary_rep = least_sig(binary_rep, 8);
        } else {
            binary_rep = "0".repeat(8 - binary_rep.length) + binary_rep;
        }
        return twos_to_decimal(binary_rep, 8); 
    }],
    [binary_to_hex, function(binary) { return twos_to_decimal(binary, 8); }],
    [function(decimal) { return binary_to_hex(decimal_to_twos(decimal, 8)); }, function(decimal) { return decimal_to_twos(decimal, 8) }],
], "8-bit Two's Complement Integer Representation");

var int32 = new ConversionComponent(["Hexadecimal", "Binary (Two's Complement)", "Decimal"], [
    [function(hex) {
        if (hex == "") {
            return ""
        }
        var binary_rep = hex_to_binary(hex);
        if (binary_rep == "") {
            return ""
        }
        if (binary_rep.length > 32) {
            binary_rep = least_sig(binary_rep, 32);
        } else {
            binary_rep = "0".repeat(32 - binary_rep.length) + binary_rep;
        }
        return binary_rep; 
    }, function(hex) {
        if (hex == "") {
            return ""
        }
        var binary_rep = hex_to_binary(hex);
        if (binary_rep == "") {
            return ""
        }
        if (binary_rep.length > 32) {
            binary_rep = least_sig(binary_rep, 32);
        } else {
            binary_rep = "0".repeat(32 - binary_rep.length) + binary_rep;
        }
        return twos_to_decimal(binary_rep, 32); 
    }],
    [binary_to_hex, function(binary) { return twos_to_decimal(binary, 32); }],
    [function(decimal) { return binary_to_hex(decimal_to_twos(decimal, 32)); }, function(decimal) { return decimal_to_twos(decimal, 32) }],
], "32-bit Two's Complement Integer Representation (int32)");

class ConversionComponentV2 { //A more elegant Conversion compoment.
    constructor(list_of_types, funcs, title) {
        this.types = list_of_types;
        this.idPrefix = Math.random().toString(36).substring(2);
        this.funcs = funcs;
        this.title = "<h3>" + title + "</h3>\n<p>" + this.types.join(" &#8596; ") + "</p>";
        if (this.types.length != this.funcs.length) {
            console.log("Bad args for calcv2!")
        }
    }

    mount() {
        var self = this;
        var num_elems = this.types.length;
        var funcs = this.funcs;
        var html = '<div class="calc">' + this.title;
        for (var i in this.types) {
            var elemId = this.idPrefix + i;
            html += '<div><input type="text" class="' + this.idPrefix + '" id="' + elemId + '"> ' + this.types[i] + "</div>";
            (function() {
                var k = i;
                $("#content").on("input", "#" + elemId, function() {
                    //k is our index
                    var fi = parseInt(k);
                    var lastValue = this.value;
                    var inputElems = $("." + self.idPrefix);
                    for (var m = 0; m < num_elems-1; m += 1) { //runs one less than length times
                        var convertedValue = funcs[fi%num_elems](lastValue);
                        $("body").find("#" + inputElems[(fi+1)%num_elems].id).val(convertedValue);
                        lastValue = convertedValue;
                        fi += 1;
                    }
                });
            })(); //must call to preserve frame
        }
        html += "</div>"
        $("#content").append(html);
    }
}

var distance = new ConversionComponentV2(
    [
        'Miles', 'Yards', 'Feet', 'Inches', 
        'Kilometers (10^3)', 'Hectometers (10^2)', 'Decameters (10^1)', 'Meters (10^0)', 
        'Decimeters (10^-1)', 'Centimeters (10^-2)', 'Millimeters (10^-3)'
    ], [
        function(miles) {
            if (isNaN(parseFloat(miles))) {
                return ""
            }
            miles = new Decimal(miles);
            return miles.times(1760);
        },
        function(yards) {
            if (isNaN(parseFloat(yards))) {
                return ""
            }
            yards = new Decimal(yards);
            return yards.times(3);
        },
        function(feet) {
            if (isNaN(parseFloat(feet))) {
                return ""
            }
            feet = new Decimal(feet);
            return feet.times(12);
        },
        function(inches) { //to km
            if (isNaN(parseFloat(inches))) {
                return ""
            }
            inches = new Decimal(inches);
            return inches.times(0.0254).dividedBy(1000);
        },
        function(k) { //km -> Dm
            if (isNaN(parseFloat(k))) {
                return ""
            }
            k = new Decimal(k);
            return k.times(10);
        },
        function(k) { //km -> Dm
            if (isNaN(parseFloat(k))) {
                return ""
            }
            k = new Decimal(k);
            return k.times(10);
        },
        function(k) { //km -> Dm
            if (isNaN(parseFloat(k))) {
                return ""
            }
            k = new Decimal(k);
            return k.times(10);
        },
        function(k) { //km -> Dm
            if (isNaN(parseFloat(k))) {
                return ""
            }
            k = new Decimal(k);
            return k.times(10);
        },
        function(k) { //km -> Dm
            if (isNaN(parseFloat(k))) {
                return ""
            }
            k = new Decimal(k);
            return k.times(10);
        },
        function(k) { //km -> Dm
            if (isNaN(parseFloat(k))) {
                return ""
            }
            k = new Decimal(k);
            return k.times(10);
        },
        function(k) { //mm to miles
            if (isNaN(parseFloat(k))) {
                return ""
            }
            k = new Decimal(k);
            return k.dividedBy(1000).dividedBy(1609.344);
        },
], "Distance Conversion*")

class FunctionComponent {
    constructor(labels, func, title) {
        this.labels = labels;
        this.func = func;
        this.title = "<h3>" + title + "</h3>";
        this.idPrefix = Math.random().toString(36).substring(2);
    }

    mount() {
        var self = this;
        var html = '<div class="calc">' + this.title;
        for (var i in this.labels) {
            var elemId = this.idPrefix + i;
            html += '<div><input type="text" class="' + this.idPrefix + '" id="' + elemId + '"> ' + this.labels[i] + "</div>";
            (function() {
                var k = i;
                $("#content").on("input", "#" + elemId, function() {
                    var args = [];
                    var inputElems = $("." + self.idPrefix);
                    for (var m = 0; m < inputElems.length; m++) {
                        args.push(inputElems[m].value)
                    }
                    var res = self.func(args);
                    $("body").find("#" + self.idPrefix + 'result').html(res)
                });
            })(); //must call to preserve frame
        }
        html += "<div id='" + this.idPrefix + "result'></div>"
        html += "</div>"
        $("#content").append(html);
    }
}

class FunctionComponentOptions {
    constructor(labels, func, title) {
        this.labels = labels;
        this.func = func;
        this.title = "<h3>" + title + "</h3>";
        this.idPrefix = Math.random().toString(36).substring(2);
    }

    mount() {
        var self = this;
        var html = '<div class="calc">' + this.title;
        for (var i in this.labels) {
            var elemId = this.idPrefix + i;
            html += '<div><input type="text" class="' + this.idPrefix + 'text ' + this.idPrefix + '" id="' + elemId + '"> ' + this.labels[i][0] + " ";
            html += "<select class='" + this.idPrefix + " " + this.idPrefix + "sel'>";
            for (var q in this.labels[i][1]) {
                html += '<option value="' + this.labels[i][1][q] + '">';
                html += this.labels[i][1][q]
                html += "</option>";
            }
            html +="</select>";
            html += "</div>";
            (function() {
                var k = i;
                $("#content").on("input", "." + self.idPrefix, function() {
                    var args = [];
                    var inputElems = $("." + self.idPrefix + 'text');
                    var inputElems2 = $("." + self.idPrefix + "sel");
                    for (var m = 0; m < inputElems.length; m++) {
                        args.push([inputElems[m].value, inputElems2[m].value])
                    }
                    var res = self.func(args);
                    $("body").find("#" + self.idPrefix + 'result').html(res)
                });
            })(); //must call to preserve frame
        }
        html += "<div id='" + this.idPrefix + "result'></div>"
        html += "</div>"
        $("#content").append(html);
    }
}

var finalGrade = new FunctionComponent([
    "Current grade (%)?",
    "Final is worth how many percent (%)?",
], function(args) {
    var currentGrade = args[0];
    var finalPercent = args[1];
    if (isNaN(parseFloat(currentGrade)) || isNaN(parseFloat(finalPercent))) {
        return "Please enter valid numbers."
    }
    currentGrade = parseFloat(currentGrade);
    finalPercent = parseFloat(finalPercent);
    if (finalPercent == 0) {
        return "The final is worth nothing? Then you'll just get what you have, " + currentGrade + "%"
    }
    finalPercent = finalPercent/100;

    var result = "";
    for (var grade = 100; grade >= 0; grade -= 0) {
        var gradeNeeded = (grade - (currentGrade*(1-finalPercent)))/finalPercent;
        result += "To get a " + grade + "% in the class you will need at least a " + Math.ceil(gradeNeeded) + "% on the final<br>"
        if (grade > 92) {
            grade -= 4;
        } else if (grade > 88) {
            grade -= 2;
        }else if (grade == 88) {
            grade -= 3;
        }  else if (grade > 70) {
            grade -= 5;
        } else {
            grade -= 10;
        }
    }
    return result;
}, "What grade do I need to get on the final?")

var bmi = new FunctionComponentOptions([
    ["Weight", ["lb", "kg"]],
    ["Height", ["ft'in", "inches", "cm", "m"]],
], function(args) {
    var w = args[0][0];
    var h = args[1][0];
    if (isNaN(parseFloat(w))) {
        return "Please enter valid numbers"
    }
    w = parseFloat(w);
    if (args[0][1] == "lb") {
        w = w/2.205;
    }
    console.log(args[1][1])
    if (args[1][1] == "ft'in") {
        var ft = parseInt(h.split("'")[0])
        var inches = h.split("'")[1]
        if (inches == "" || inches == undefined) {
            inches = 0;
        } else { 
            inches = parseInt(inches)
        }
        h = ft*12 + inches
        args[1][1] = "inches";
    }
    if (args[1][1] == "inches") {
        h = parseFloat(h);
        h = h/39.37;
        console.log(h)
    } else if (args[1][1] == "cm") {
        h = parseFloat(h);
        h /= 100;
    } else if (args[1][1] == "m") {
        h = parseFloat(h);
    }
    if (isNaN(parseFloat(h))) {
        return "Please enter valid numbers"
    }
    var index = (w / (h*h));
    if (isNaN(index)) {
        return "Please enter valid numbers"
    }
    var result = "BMI: " + index.toPrecision(3);
    if (index < 19) {
        result += "<br> According to conventional interpretation, this is underweight"
    } else if (index < 25) {
        result += "<br> According to conventional interpretation, this is a healthy weight"
    } else if (index < 30) {
        result += "<br> According to conventional interpretation, this is overweight"
    } else if (index < 40) {
        result += "<br> According to conventional interpretation, this is obese"
    } else {
        result += "<br> According to conventional interpretation, this is extremely obese"
    }
    result += "<br>For more information: <a href='https://en.wikipedia.org/wiki/Body_mass_index#Limitations'>https://en.wikipedia.org/wiki/Body_mass_index#Limitations</a>"
    return result;
}, "BMI Calculator")

var temp = new ConversionComponentV2(["Celsius (°C)", "Kelvin (K)", "Fahrenheit (°F)"], [
    function(i) {
        if (isNaN(parseFloat(i))) {
            return "";
        }
        var res = parseFloat(i) + 273;
        if (res < 0) {
            return 0;
        }
        return res;
    },
    function(i) {
        if (isNaN(parseFloat(i))) {
            return "";
        }
        if (parseFloat(i) < 0) {
            return "";
        }
        i = new Decimal(i);
        return i.minus(273).times(5).dividedBy(9).plus(32);
    },
    function(i) {
        if (isNaN(parseFloat(i))) {
            return "";
        }
        i = new Decimal(i);
        return i.minus(32).times(9).dividedBy(5);
    },
], "Temperature*");

var float_to_decimal = function(ft) {
    var absVal;
    var width = 32;
    var expBits = 8;
    var significandBits = 23;
    var bias = 127;
    if (ft == "" || ft.length != width) { return ""; } 
    var sign = ft.charAt(0);
    var exp = ft.substring(1, 1+expBits);
    var significand = ft.substring(1+expBits, width) + "0".repeat(bias);
    var denorm = false;
    if (exp == "0".repeat(expBits)) {
        denorm = true;
    }
    exp = binary_to_decimal(exp);
    if (exp == (bias*2)+1){
        if (significand.substring(0, significandBits) != "0".repeat(significandBits)) {
            console.log("NaN case")
            return "NaN"
        }
        absVal = parseFloat("Infinity")
    } else {
        exp = exp - bias;
        if (denorm || exp == 0) {
            significand = "0" + significand;
            exp = -1 * (bias-1);
        } else {
            significand = "1" + significand;
        }
        var intBitstring; 
        var fracBitstring;
        if (exp < 0) {
            intBitstring = "0"
            fracBitstring = "0".repeat((-1*exp)-1) + significand;
            //Dont chop for gt precision
        } else if (exp > 0) {
            intBitstring = significand.substring(0, 1+exp);
            fracBitstring = significand.substring(1+exp, significand.length);
        } else { //exp == 0
            intBitstring = significand.charAt(0);
            fracBitstring = significand.substring(1, significand.length);
        }
        console.log(intBitstring)
        console.log(fracBitstring)
        console.log(exp)
        var fracValue = 0;
        var frac = 2;
        for (var i = 0; i < fracBitstring.length; i++) {
            if (fracBitstring.charAt(i) == "1") {
                fracValue += 1/frac;
            }
            frac *= 2;
        }
        absVal = parseFloat(binary_to_decimal(intBitstring)) + fracValue;
    }
    if (sign == "1") {
        return absVal * -1;
    }
    return absVal;
}

var decimal_to_float = function(dec) {
    var width = 32;
    var expBits = 8;
    var significandBits = 23;
    var bias = 127;
    var sign;
    if (isNaN(parseFloat(dec))) {
        return ""
    } else if (dec == "Infinity") {
        return "0" + "1".repeat(expBits) + "0".repeat(significandBits);
    } else if (dec == "-Infinity") {
        return "1" + "1".repeat(expBits) + "0".repeat(significandBits);
    }
    var result = "";
    if (parseFloat(dec) < 0) {
        sign = "1";
        dec = dec.substring(1, dec.length); //cut off negative
    } else if (parseFloat(dec) == 0) {
        return "0".repeat(32);
    } else {
        sign = "0";
    }
    var intPart = decimal_to_binary_unsigned(dec.split(".")[0]);
    if (intPart == "0") {
        intPart = ""
    }
    var fracPart = dec.split(".")[1];
    if (fracPart == undefined || fracPart == "") {
        fracPart = "0".repeat(bias);
    } else {
        var fp = parseFloat("0." + fracPart);
        var fracPartBinary = "";
        for (var i = 0; i < bias; i++) {
            fp = fp * 2;
            if (fp > 1) {
                fp = fp - 1;
                fracPartBinary += "1";
            } else if (fp == 1) {
                fracPartBinary += "1";
                fracPartBinary += "0".repeat(bias-i);
                break;
            } else {
                fracPartBinary += "0";
            }
        }
        fracPart = fracPartBinary;
    }
    var significand; //not trimmed yet
    var exp;
    if (intPart > 0) {
        exp = intPart.length-1;
        significand = intPart + fracPart;
        significand = significand.substring(1, significand.length); //lop off implicit 1
    } else {
        exp = 0;
        var k = 0;
        while (fracPart[k] == 0) {
            exp -= 1;
            k += 1;
        }
        exp -= 1; //handle denorms heah. A bit broken. TODO: Fix
        if (exp == -1*bias) {
            significand = fracPart.substring((-1*exp) - 1, fracPart.length);             
        } else {
            significand = fracPart.substring(-1*exp, fracPart.length); 
        }        
    }
    exp += bias;
    significand += "0".repeat(bias)
    result += sign + least_sig("0".repeat(expBits) + decimal_to_binary_unsigned("" + exp), expBits)
    result += significand.substring(0, significandBits);
    return result;
}

var float = new ConversionComponent(["Hexadecimal", "Binary (IEEE 754)", "Decimal"], [
    [function(hex) {
        if (hex == "") {
            return ""
        }
        var binary_rep = hex_to_binary(hex);
        if (binary_rep == "") {
            return ""
        }
        if (binary_rep.length > 32) {
            binary_rep = least_sig(binary_rep, 32);
        } else {
            binary_rep = "0".repeat(32 - binary_rep.length) + binary_rep;
        }
        return binary_rep; 
    }, function(hex) {
        if (hex == "") {
            return ""
        }
        var binary_rep = hex_to_binary(hex);
        if (binary_rep == "") {
            return ""
        }
        if (binary_rep.length > 32) {
            binary_rep = least_sig(binary_rep, 32);
        } else {
            binary_rep = "0".repeat(32 - binary_rep.length) + binary_rep;
        }
        return float_to_decimal(binary_rep); 
    }],
    [binary_to_hex, function(binary) { return float_to_decimal(binary); }],
    [function(decimal) { return binary_to_hex(decimal_to_float(decimal)); }, function(decimal) { return decimal_to_float(decimal) }],
], "32-bit Float Representation (float)*");
