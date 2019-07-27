<template>
    <v-container grid-list-md>
        <v-snackbar
            v-model="snackbar"
            top
            :color="color"
            >
            {{ message }}
            <v-btn
                color="white"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
            </v-snackbar>
        <v-layout wrap>
            <v-flex xs5>
                <v-card>
                    <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Form</v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>

                    <v-form>
                        <v-list-item>
                            <v-select
                            v-model="form.category"
                            :items="items"
                            label="Item"
                            :rules="[v => !!v || 'Item is required']"
                            required
                            ></v-select>
                        </v-list-item>
                        <v-list-item>
                            <v-file-input
                            @change="onChangeFile"
                            :rules="[v => !!v || 'Image is required']"
                            accept="image/*"
                            label="Choose Image">
                            </v-file-input>
                        </v-list-item>
                    </v-form>
                    <v-card-actions>
                        <v-btn
                            color="green"
                            text
                            @click="submit"
                            :loading="loading"
                        >
                            Submit
                        </v-btn>
                        <span
                            v-if="loading"
                        >Submitting ...</span>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex xs7 justify-center>
                <v-flex xs12>
                    <v-card>
                    <v-toolbar light>
                        <v-spacer></v-spacer>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                color="primary"
                                v-on="on"
                                >
                                Filter by {{ collection_name }}
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item
                                v-for="(item, index) in items"
                                :key="index"
                                @click="filterBy(item)"
                                >
                                <v-list-item-title>{{ item }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                            </v-menu>
                    </v-toolbar>
                    </v-card>
                </v-flex>
                <v-layout wrap>
                    <v-flex xs6 v-for="(photo, index) in gallery" :key="index">
                        <v-card>
                            <v-img
                            :src="'/storage/' + photo.id + '/' + photo.file_name"
                            class="white--text"
                            height="200px"
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            >
                            </v-img>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text :color="photo.is_liked ? 'primary':''" @click="isLiked(photo)">
                                    <v-icon left>{{ photo.is_liked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'}}</v-icon>
                                    {{ photo.is_liked ? 'Unlike' : 'Like'}}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        items: [
            'Nature',
            'Cars',
            'People',
        ],
        form: {},
        loading: false,
        gallery: [],
        collection_name: '',
        snackbar: false,
        message: '',
        color: ''
    }),
    created () {
        this.getPhotos()
    },
    methods: {
        getPhotos () {
            axios.get('/gallery?filter[collection_name]=' + this.collection_name)
                .then((response) => {
                    // handle success
                    this.gallery = response.data
                })
                .catch((response) => {
                    // handle error
                    console.log(error);
                })
        },
        onChangeFile (e) {
            this.form.image = e
        },
        isLiked (media_info) {
            let form = {
                is_liked: media_info.is_liked ? 0 : 1,
                _method: 'put'
            }

            axios.post('/gallery/' + media_info.id, form)
            .then((response) => {
                // handle success
                this.getPhotos()
                this.loading = false
            })
            .catch((response) => {
                // handle error
                console.log(error);
                this.loading = false
            })
        },
        submit () {
            this.loading = true
            let form = new FormData()
            form.set('category', this.form.category)
            form.set('image', this.form.image)

            axios.post('/gallery', form)
                .then((response) => {
                    // handle success
                    this.getPhotos()
                    this.loading = false
                    this.snackbar = true
                    this.message = 'Media added successfully.'
                    this.color = 'success'
                })
                .catch((response) => {
                    // handle error
                    this.loading = false
                    this.snackbar = true
                    this.message = 'Something went wrong.'
                    this.color = 'red'
                })
        },
        filterBy (collection_name) {
            this.collection_name = collection_name
            this.getPhotos()
        }
    }
}
</script>
