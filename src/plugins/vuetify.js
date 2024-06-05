import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '../assets/scss/index.scss'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            //Se definen colores globales para el tema claro
            light : {
                blueMinsal:'#175EFB',   
                blueGrayMinsal:'#6A83BE',   
                blueDarkMinsal:'#090A0D',
                bgMinsal:'#F4F7FD',
                bgWhite:"#FFFFFF",
                primary: '#175EFB',
            },
            dark:{
                bgMinsal:'#2f3032',
                blueMinsal:'#175EFB',   
                blueGrayMinsal:'#6A83BE',   
                blueDarkMinsal:'#090A0D',
                primary: '#175EFB'
                // primary: {
                //     base: colors.purple.base,
                // }
            }
        }
    }
});
