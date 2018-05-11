'use strict';
import React,{Component} from 'react'
import  {
    StyleSheet,
    Text,
    View,
    Image,
    ToastAndroid,
} from 'react-native';
var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';
export default class LoadDatas extends Component {
    //返回当前显示的view
    render() {
        // ToastAndroid.show(JSON.stringify(this.state.movies),ToastAndroid.SHORT)
        //由于刚开始的的时候设置movies的职位空，所以第一次会加载等待的view
        if (!this.state.movies) {
            return this.renderLoadingView();
        }
        //只获取第一个数组的数据
        var movie = this.state.movies[0];
        return this.renderMovie(movie);
    }
    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>
                    Loading movies...
                </Text>
            </View>
        );
    }
    //获取到数据加载到控件上
    renderMovie(movie) {
        return (
            <View style={styles.container}>
                <Image
                    source={{uri: movie.posters.thumbnail}}
                    style={styles.thumbnail}
                />
                <View style={styles.rightContainer}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <Text style={styles.year}>{movie.year}</Text>
                </View>
            </View>
        );
    }
    //js组件的构造函数，js的生命周期
    constructor(props) {
        super(props);
        //state内部维护的一个状态，我们刚开始进来的为空，来加载空的view
        this.state = {
            movies: null,
        };

    }

    //rn的生命周期，初始化的时候会执行
    componentDidMount() {
        //去拉取电影的接口的数据
        this.fetchData();
    }


    fetchData() {
        //这个是js的访问网络的方法
        fetch(REQUEST_URL)
        //ES6的写法左边代表输入的参数右边是逻辑处理和返回结果
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    movies: responseData.movies,
                });
            })
            .done();
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    year: {
        textAlign: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    rightContainer: {
        flex: 1,
    },
    thumbnail: {
        width: 53,
        height: 81,
    },
});

