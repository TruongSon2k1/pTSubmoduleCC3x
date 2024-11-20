

export const str = {
    random_character: function(divided: boolean = false) {
        const rander = Math.random() * 26 >> 0;
        const step = divided ? (Math.random() < 0.5 ? 65 : 97) : 65;
        return String.fromCharCode(step + rander);
    },

    char_replacer_at: function(str: string, index: number, char: string) {
        if (str.length <= index) {
            str += ' '.repeat(index - str.length);
        }
        return str.substring(0, index) + char + str.substring(index + 1);
    }
}
